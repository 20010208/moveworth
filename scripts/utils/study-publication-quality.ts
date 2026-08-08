/**
 * study_blog_posts（study-work-*, study-country-*）の生成・公開経路が共通で使う
 * 「承認済みsource（country_sources由来）に基づく参考資料の検証・注入」ロジック。
 *
 * 設計方針（Codex監査 5fad1b8 FAIL の是正）:
 *   - 「公式リンクかどうか」は country_sources（status=alive, purpose IN ('study','visa')）
 *     に登録されたURLとの一致でのみ判定する。ドメイン文字列（.gov 等）による推測はしない。
 *   - country_sources取得時のDBエラーは握り潰さず throw する（0件と障害を区別する）。
 *   - 取得順序はDB応答順に依存させず、study優先 → normalized URL昇順で決定的にソートする。
 *   - 参考資料セクションの検出は本文中の文字列検索（indexOf等）ではなく、行単位で
 *     Markdown見出し（H1〜H6）または完全一致の1行のみを開始行として扱う。
 */
import type { SupabaseClient } from "@supabase/supabase-js";

export type Lang = "ja" | "en" | "zh";

export const REF_HEADING_TEXT: Record<Lang, string> = {
  ja: "参考資料",
  en: "References",
  zh: "参考资料",
};

export type ApprovedSource = {
  url: string;
  purpose: string;
  normalized: string;
};

// ─── URL正規化 ──────────────────────────────────────────────────────────────

const TRACKING_PARAM_EXACT = new Set([
  "gclid", "fbclid", "msclkid", "mc_cid", "mc_eid", "igshid", "yclid",
]);

function isTrackingParam(key: string): boolean {
  const k = key.toLowerCase();
  if (k.startsWith("utm_")) return true;
  return TRACKING_PARAM_EXACT.has(k);
}

/**
 * 比較・重複排除専用の正規化キーを生成する。
 * - scheme / hostname を小文字化
 * - デフォルトポート（http:80, https:443等）はURL APIが自動的に除去する
 * - fragment（#...）を除去
 * - root以外の末尾slashを除去（"/path/" → "/path"、ただし "/" はそのまま）
 * - tracking parameter（utm_*, gclid, fbclid 等）を比較キーから除外し、
 *   残りのquery parameterはkey昇順で安定化する
 * - 機能的なquery parameterは削除しない（表示用の元URLも別途保持すること）
 */
export function normalizeUrl(raw: string): string {
  try {
    const u = new URL(raw.trim());
    u.protocol = u.protocol.toLowerCase();
    u.hostname = u.hostname.toLowerCase();
    u.hash = "";

    if (u.pathname.length > 1 && u.pathname.endsWith("/")) {
      u.pathname = u.pathname.replace(/\/+$/, "") || "/";
    }

    const params = [...u.searchParams.entries()].filter(([k]) => !isTrackingParam(k));
    params.sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
    u.search = "";
    for (const [k, v] of params) u.searchParams.append(k, v);

    return u.toString();
  } catch {
    return raw.trim().toLowerCase();
  }
}

// ─── 参考資料セクションのURL抽出 ──────────────────────────────────────────────

export function extractUrls(text: string): string[] {
  if (!text) return [];
  const urls = new Set<string>();
  const mdRe = /\[[^\]]*\]\((https?:\/\/[^\s)]+)\)/g;
  let m: RegExpExecArray | null;
  while ((m = mdRe.exec(text)) !== null) urls.add(m[1]);
  const htmlRe = /<a\s+[^>]*href=["'](https?:\/\/[^"']+)["']/gi;
  while ((m = htmlRe.exec(text)) !== null) urls.add(m[1]);
  const rawRe = /https?:\/\/[^\s)"'<>\]]+/g;
  while ((m = rawRe.exec(text)) !== null) urls.add(m[0].replace(/[.,;)]+$/, ""));
  return [...urls];
}

// ─── 参考資料セクションの行単位パーサー ───────────────────────────────────────

function parseHeadingLine(line: string): { level: number; text: string } | null {
  const m = line.match(/^(#{1,6})\s+(.*)$/);
  if (!m) return null;
  return { level: m[1].length, text: m[2].trim() };
}

export type RefSection = {
  startLine: number;
  endLine: number; // exclusive
  headingLevel: number | null; // null = 見出し記号なしの完全一致1行
  raw: string;
};

/**
 * 本文を行単位で走査し、参考資料セクションを検出する。
 * 開始行として許可するのは、
 *   - H1〜H6見出し行でテキストが完全一致（例: "### 参考資料"）
 *   - 見出し記号なしの完全一致1行（例: "参考資料" のみの行）
 * のいずれかのみ。文中に埋め込まれた「詳しくは参考資料をご覧ください」等は対象外。
 * 終了位置は開始行より後の直近のH1〜H6見出し行、なければEOF。
 */
export function findRefSection(content: string, lang: Lang): RefSection | null {
  const headingText = REF_HEADING_TEXT[lang];
  const lines = content.split("\n");

  let startLine = -1;
  let headingLevel: number | null = null;
  for (let i = 0; i < lines.length; i++) {
    const h = parseHeadingLine(lines[i]);
    if (h && h.text === headingText) {
      startLine = i;
      headingLevel = h.level;
      break;
    }
    if (!h && lines[i].trim() === headingText) {
      startLine = i;
      headingLevel = null;
      break;
    }
  }
  if (startLine === -1) return null;

  let endLine = lines.length;
  for (let i = startLine + 1; i < lines.length; i++) {
    if (parseHeadingLine(lines[i])) {
      endLine = i;
      break;
    }
  }

  return {
    startLine,
    endLine,
    headingLevel,
    raw: lines.slice(startLine, endLine).join("\n"),
  };
}

// ─── country_sources からのapproved source取得（fail-closed） ────────────────

/**
 * country_code の study/visa alive source を **全件** 取得する（上限なし）。
 * - Supabaseクエリがerrorを返した場合は必ずthrowする（[]へのフォールバックは禁止。
 *   「DB障害」と「正常に0件」を呼び出し側が区別できるようにするため）。
 * - 取得順序はDB応答順に依存させない: study優先 → normalized URL昇順で決定的にソートしてから
 *   重複排除する（同一URLがstudy/visa双方にある場合はstudy側の行を優先して残す）。
 *
 * 重要: この関数の戻り値は「publication validatorが判定に使うapproved registry全体」である。
 * 5件等への上限は一切適用しない（Codex指摘: 上限で切られた集合をvalidatorにも流用すると、
 * registryにaliveで正式登録済みのURLが辞書順で6件目以降になっただけで「未承認」と誤判定される
 * ＝ registryを増やすほど再発する構造的バグになる）。
 * 記事へ機械挿入する参考資料用に件数を絞りたい場合は、この関数の戻り値に対して
 * 別途 selectStudyReferenceSources() を適用すること。
 */
export async function getApprovedSources(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: SupabaseClient<any, any, any>,
  countryCode: string
): Promise<ApprovedSource[]> {
  const { data, error } = await supabase
    .from("country_sources")
    .select("url, purpose")
    .eq("country_code", countryCode)
    .eq("status", "alive")
    .in("purpose", ["study", "visa"]);

  if (error) {
    throw new Error(`country_sources取得失敗 (country_code=${countryCode}): ${error.message}`);
  }

  const rows = (data ?? []) as { url: string; purpose: string }[];
  const withNorm = rows.map((r) => ({ ...r, normalized: normalizeUrl(r.url) }));

  const purposeRank = (p: string) => (p === "study" ? 0 : p === "visa" ? 1 : 2);
  withNorm.sort((a, b) => {
    const pr = purposeRank(a.purpose) - purposeRank(b.purpose);
    if (pr !== 0) return pr;
    const nr = a.normalized < b.normalized ? -1 : a.normalized > b.normalized ? 1 : 0;
    if (nr !== 0) return nr;
    // normalizedキーが同じ（例: 大文字小文字違い・末尾slash違い）raw URLが複数存在する場合、
    // DB応答順に依存せず raw URLの辞書順で採用値を決定的にする（Codex指摘 tie-break）。
    return a.url < b.url ? -1 : a.url > b.url ? 1 : 0;
  });

  const seen = new Set<string>();
  const deduped: ApprovedSource[] = [];
  for (const r of withNorm) {
    if (seen.has(r.normalized)) continue;
    seen.add(r.normalized);
    deduped.push(r);
  }

  return deduped;
}

/**
 * 記事へ機械挿入する参考資料表示用に、approved registry全体（getApprovedSourcesの戻り値。
 * study優先→normalized URL昇順→raw URL辞書順で既に決定的にソート済み）から先頭max件を選ぶ。
 * 単なる配列slice（pure function）であり、DBアクセスは行わない。
 *
 * 呼び出し側はこの関数の戻り値を publication validator（validateStudyPublication）へ
 * 渡してはならない。validatorには必ず getApprovedSources() の全件を渡すこと
 * （表示用に絞った集合を承認判定に流用すると、registryにaliveで正式登録済みのURLが
 * 辞書順で max件目以降になっただけで「未承認」と誤判定されるため）。
 */
export function selectStudyReferenceSources(allSources: ApprovedSource[], max = 5): ApprovedSource[] {
  return allSources.slice(0, max);
}

// ─── 参考資料セクションの機械注入 ──────────────────────────────────────────────

const STUDY_FALLBACK_TEXT: Record<Lang, string> = {
  ja: "最新の情報は各国の入国管理局・大使館の公式サイトでご確認ください。",
  en: "For the latest information, please refer to the official immigration authority or embassy website of your destination country.",
  zh: "最新信息请参阅各国入境管理局和大使馆的官方网站。",
};

const STUDY_GROUNDED_INTRO: Record<Lang, string> = {
  ja: "本記事の情報は以下の公式資料をもとに作成しています。",
  en: "Data sourced from official government and immigration authority pages.",
  zh: "本文信息来源于以下官方资料。",
};

/**
 * 既存の参考資料セクションを findRefSection で厳密に検出して除去し、
 * refsMarkdown（呼び出し側が urlToLabel 等で組み立てた箇条書き）を注入する。
 * refsMarkdown が空/null の場合は静的fallback文言を注入する（isGrounded=false相当）。
 * H1〜H6・区切り記号なしの旧形式など、どの見出しレベルで書かれていても正しく1セクションだけ
 * 検出・置換する（旧実装が "### " 固定文字列検索だったため "## 参考資料" 等を認識できず
 * 二重セクション化していた問題を解消）。
 *
 * 参考資料セクションより後ろに別のセクション（例: "## 注意事項"）が存在する場合、
 * その本文は section.endLine 以降として保持し、置換後も欠落させない
 * （Codex指摘: 旧実装は section 以降の本文を丸ごと破棄していた）。
 */
export function injectApprovedRefs(
  content: string,
  lang: Lang,
  refsMarkdown: string | null
): string {
  const lines = content.split("\n");
  const section = findRefSection(content, lang);
  const beforeLines = section ? lines.slice(0, section.startLine) : lines;
  const afterLines = section ? lines.slice(section.endLine) : [];

  let before = beforeLines.join("\n").replace(/\n?-{3,}\s*$/, "").trimEnd();
  const after = afterLines.join("\n").trim();

  const heading = REF_HEADING_TEXT[lang];
  const refsBlock =
    !refsMarkdown || refsMarkdown.trim().length === 0
      ? `### ${heading}\n${STUDY_FALLBACK_TEXT[lang]}`
      : `---\n\n### ${heading}\n${STUDY_GROUNDED_INTRO[lang]}\n${refsMarkdown}`;

  if (after.length === 0) {
    return `${before}\n\n${refsBlock}`;
  }
  return `${before}\n\n${refsBlock}\n\n${after}`;
}

// ─── 公開品質バリデーション ─────────────────────────────────────────────────

const REFUSAL_PATTERNS = [
  "申し訳ありません", "I cannot", "I'm sorry", "As an AI", "I'm unable",
  "cannot access the internet", "インターネットへのアクセス",
  "我无法", "对不起", "很抱歉",
];

export type ValidationResult = { ok: boolean; reasons: string[] };

export type Metadata = Partial<Record<Lang, string>>;

/**
 * title/description 用のmetadataフィールドを検証する。
 *   - ja/en/zh すべてが string型であること
 *   - trim後非空であること
 *   - OpenAI拒否文言が混入していないこと
 * 理由は `${field}.${lang} ...` の形式で column/lang が分かるようにする。
 */
function validateMetadataField(field: "title" | "description", value: Metadata, reasons: string[]): void {
  for (const lang of ["ja", "en", "zh"] as Lang[]) {
    const v = value[lang];
    if (typeof v !== "string") {
      reasons.push(`${field}.${lang} missing (not a string)`);
      continue;
    }
    if (v.trim().length === 0) {
      reasons.push(`${field}.${lang} missing (empty)`);
      continue;
    }
    for (const p of REFUSAL_PATTERNS) {
      if (v.includes(p)) reasons.push(`${field}.${lang} contains refusal pattern: "${p}"`);
    }
  }
}

/**
 * title.ja/en/zh, description.ja/en/zh, content.ja/en/zh すべてについて検証する
 * （1つでも満たさなければ ok=false）。
 *
 * title/description:
 *   - string型かつtrim後非空であること
 *   - OpenAI拒否文言が混入していないこと
 *
 * content（ja/en/zh各言語）:
 *   - contentが存在し200文字以上
 *   - example.com混入なし
 *   - OpenAI拒否文言なし
 *   - 言語に対応した参考資料セクションが存在する
 *   - セクション内にURLが1件以上ある
 *   - セクション内URLのうち最低1件が、approvedSources と normalized比較で一致する
 * 単なる外部URL（Wikipedia・民間ブログ・Wise等）の存在だけではPASSしない。
 */
export function validateStudyPublication(input: {
  title: Metadata;
  description: Metadata;
  content: Partial<Record<Lang, string>>;
  approvedSources: ApprovedSource[];
}): ValidationResult {
  const { title, description, content, approvedSources } = input;
  const approvedNormSet = new Set(approvedSources.map((s) => s.normalized));
  const langs: Lang[] = ["ja", "en", "zh"];
  const reasons: string[] = [];

  validateMetadataField("title", title, reasons);
  validateMetadataField("description", description, reasons);

  for (const lang of langs) {
    const text = content[lang] ?? "";
    if (text.trim().length === 0) {
      reasons.push(`content.${lang} が空/未設定`);
      continue;
    }
    if (text.length < 200) reasons.push(`content.${lang} 短すぎ (${text.length}文字)`);
    if (text.includes("example.com")) reasons.push(`content.${lang} に example.com 混入`);
    for (const p of REFUSAL_PATTERNS) {
      if (text.includes(p)) reasons.push(`content.${lang} にGPT拒否パターン: "${p}"`);
    }

    const section = findRefSection(text, lang);
    if (!section) {
      reasons.push(`content.${lang} に参考資料sectionがない`);
      continue;
    }
    const urls = extractUrls(section.raw);
    if (urls.length === 0) {
      reasons.push(`content.${lang} の参考資料section内にURLが0件`);
      continue;
    }
    const hasApproved = urls.some((u) => approvedNormSet.has(normalizeUrl(u)));
    if (!hasApproved) {
      reasons.push(`content.${lang} の参考資料section内URLがapproved source（country_sources）と一致しない`);
    }
  }

  return { ok: reasons.length === 0, reasons };
}

/**
 * DB保存済みcontentが「一般的な注意書きのみ」のfallback文言のままでないかを判定する
 * （--publish-only 等、buildStudyRefs の isGrounded を再利用できない場面で使用）。
 * ja/en/zh いずれかが未設定、またはいずれかがfallback文言を含む場合は false。
 */
export function isStudyContentGrounded(
  content: Record<string, string | null | undefined> | null | undefined
): boolean {
  if (!content) return false;
  for (const lang of ["ja", "en", "zh"] as Lang[]) {
    const text = content[lang];
    if (!text || text.trim().length === 0) return false;
    if (text.includes(STUDY_FALLBACK_TEXT[lang])) return false;
  }
  return true;
}
