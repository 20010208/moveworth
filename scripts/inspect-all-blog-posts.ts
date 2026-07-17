/**
 * blog_posts 全レコードの title / description / content 構造検査
 *
 * - is_published=true / false 両方を対象
 * - 各フィールドが null / 非オブジェクト / ja or en キー欠落 / 空文字 を検出
 * - 結果を slug, is_published, published_at, created_at 付きで列挙
 */
import { existsSync, readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";

if (existsSync(".env.local")) {
  for (const line of readFileSync(".env.local", "utf-8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq < 0) continue;
    const key = t.slice(0, eq).trim();
    if (!(key in process.env)) process.env[key] = t.slice(eq + 1).trim();
  }
}

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const PLACEHOLDER_PATTERNS = [
  /see (the )?japanese version/i,
  /日本語版をご覧ください/,
  /coming soon/i,
  /under construction/i,
  /準備中/,
  /placeholder/i,
  /translation (in progress|pending|not available)/i,
];
const PLACEHOLDER_SHORT = 200; // chars

// GPT 拒否・メタテキストパターン（本文長に関わらず全文スキャン）
const GPT_REFUSAL_PATTERNS: { pattern: RegExp; label: string }[] = [
  { pattern: /I'm sorry,?\s+but\s+I\s+can'?t\s+assist/i,            label: "GPT拒否(EN): I'm sorry, but I can't assist" },
  { pattern: /I'm sorry,?\s+I\s+can'?t\s+assist/i,                   label: "GPT拒否(EN): I'm sorry, I can't assist" },
  { pattern: /I\s+cannot\s+assist\s+with\s+that/i,                   label: "GPT拒否(EN): I cannot assist with that" },
  { pattern: /I\s+apologize,?\s+but\s+I\s+(cannot|can'?t)/i,         label: "GPT拒否(EN): I apologize, but I cannot" },
  { pattern: /I'?m\s+unable\s+to\s+(provide|assist|help|create)/i,   label: "GPT拒否(EN): I'm unable to provide/assist" },
  { pattern: /As an AI language model/i,                              label: "GPT拒否(EN): As an AI language model" },
  { pattern: /As a large language model/i,                            label: "GPT拒否(EN): As a large language model" },
  { pattern: /I don'?t have the ability to/i,                         label: "GPT拒否(EN): I don't have the ability to" },
  { pattern: /申し訳ありませんが、実在する正確なURL/,                    label: "GPT拒否(JA): 申し訳ありませんが、実在するURL" },
  { pattern: /申し訳ありませんが、.*?提供すること/,                      label: "GPT拒否(JA): 申し訳ありませんが、〜提供すること" },
  { pattern: /申し訳ございませんが、.*?(?:できません|不可能)/,           label: "GPT拒否(JA): 申し訳ございませんが" },
  { pattern: /実在する正確なURLを提供することはできません/,              label: "GPT拒否(JA): 実在するURLを提供できません" },
  { pattern: /実際のURLを提供(できません|することはできません)/,          label: "GPT拒否(JA): 実際のURLを提供できません" },
  { pattern: /我无法(提供|访问|获取|生成)/,                              label: "GPT拒否(ZH): 我无法" },
  { pattern: /对不起[，,]?\s*我(无法|不能)/,                             label: "GPT拒否(ZH): 对不起，我无法" },
  { pattern: /很抱歉[，,]?\s*我(无法|不能)/,                             label: "GPT拒否(ZH): 很抱歉，我无法" },
  { pattern: /作为(一个)?AI(语言模型|助手)/,                              label: "GPT拒否(ZH): 作为AI" },
];

function findRefusalPatterns(text: string): string[] {
  const hits: string[] = [];
  for (const { pattern, label } of GPT_REFUSAL_PATTERNS) {
    const m = text.match(pattern);
    if (m) {
      // 前後30字のコンテキストを添付
      const idx = text.search(pattern);
      const start = Math.max(0, idx - 30);
      const end = Math.min(text.length, idx + m[0].length + 30);
      const ctx = text.slice(start, end).replace(/\n/g, " ");
      hits.push(`${label} → 「…${ctx}…」`);
    }
  }
  return hits;
}

function isPlaceholderContent(text: string | null | undefined): string {
  if (!text) return "";
  const t = text.trim();
  if (t.length === 0) return "空文字";
  const pat = PLACEHOLDER_PATTERNS.find(p => p.test(t));
  if (pat) return `定型文パターン (${t.length}字)`;
  if (t.length < PLACEHOLDER_SHORT) return `短すぎる (${t.length}字)`;
  return "";
}

type FieldName = "title" | "description" | "content";
type Row = {
  slug: string;
  is_published: boolean;
  published_at: string | null;
  created_at: string | null;
  locales: string[] | null;
  title: unknown;
  description: unknown;
  content: unknown;
};

/**
 * requiredLangs: locales が null なら ["ja","en"]、設定ありならその配列
 * 宣言されていない言語の欠落はソフト警告止まり
 */
function diagnoseField(field: FieldName, val: unknown, requiredLangs: string[]): string[] {
  const issues: string[] = [];
  if (val === null || val === undefined) {
    issues.push(`${field}: NULL/undefined`);
    return issues;
  }
  if (typeof val !== "object" || Array.isArray(val)) {
    issues.push(`${field}: 型不正 (${typeof val})`);
    return issues;
  }
  const obj = val as Record<string, unknown>;
  // 必須言語チェック（ハードエラー）
  for (const lang of requiredLangs) {
    const v = obj[lang];
    if (v === undefined) {
      issues.push(`${field}.${lang}: キー欠落`);
    } else if (v === null) {
      issues.push(`${field}.${lang}: null`);
    } else if (typeof v !== "string") {
      issues.push(`${field}.${lang}: 型不正 (${typeof v})`);
    } else if ((v as string).trim().length === 0) {
      issues.push(`${field}.${lang}: 空文字`);
    }
  }
  // 非必須言語（ソフト警告）
  for (const lang of ["ja", "en", "zh"] as const) {
    if (requiredLangs.includes(lang)) continue;
    const v = obj[lang];
    if (v === undefined) {
      issues.push(`${field}.${lang}: キー欠落 (警告・非必須)`);
    } else if (v !== null && typeof v !== "string") {
      issues.push(`${field}.${lang}: 型不正 (${typeof v}) (警告)`);
    }
  }
  return issues;
}

async function main() {
  console.log("=== blog_posts 全件構造検査 ===\n");

  const { data, error } = await sb
    .from("blog_posts")
    .select("slug, is_published, published_at, created_at, locales, title, description, content")
    .order("created_at", { ascending: false });

  if (error) { console.error("取得エラー:", error.message); process.exit(1); }

  const rows = (data ?? []) as Row[];
  console.log(`総件数: ${rows.length} 件 (公開: ${rows.filter(r => r.is_published).length} 件, 非公開: ${rows.filter(r => !r.is_published).length} 件)\n`);

  const broken: Array<{ slug: string; is_published: boolean; published_at: string | null; created_at: string | null; issues: string[] }> = [];
  const ok: string[] = [];

  for (const row of rows) {
    // locales が設定されている場合はその言語のみ必須、未設定なら ja+en 必須
    const requiredLangs: string[] = row.locales && row.locales.length > 0
      ? row.locales
      : ["ja", "en"];
    const issues: string[] = [
      ...diagnoseField("title", row.title, requiredLangs),
      ...diagnoseField("description", row.description, requiredLangs),
      ...diagnoseField("content", row.content, requiredLangs),
    ];
    // zh警告のみの場合は "ok (zh欠落)" 扱いにして broken には入れない
    const hardIssues = issues.filter(i => !i.includes("警告"));
    if (hardIssues.length > 0) {
      broken.push({ slug: row.slug, is_published: row.is_published, published_at: row.published_at, created_at: row.created_at, issues });
    } else {
      ok.push(row.slug);
    }
  }

  console.log(`✅ 正常: ${ok.length} 件`);
  console.log(`❌ 構造不正: ${broken.length} 件\n`);

  if (broken.length > 0) {
    console.log("--- 構造不正レコード一覧 ---");
    for (const b of broken) {
      const pub = b.is_published ? "公開" : "非公開";
      console.log(`\n[${b.slug}]  ${pub}  published_at: ${b.published_at ?? "-"}  created_at: ${b.created_at ?? "-"}`);
      for (const issue of b.issues) {
        const warn = issue.includes("警告");
        console.log(`  ${warn ? "⚠️ " : "❌ "} ${issue}`);
      }
    }
  }

  // zh欠落のみの記事も別掲 (ソフト警告)
  const zhOnlyWarn = rows.filter(r => {
    const req = r.locales && r.locales.length > 0 ? r.locales : ["ja", "en"];
    const allIssues = [
      ...diagnoseField("title", r.title, req),
      ...diagnoseField("description", r.description, req),
      ...diagnoseField("content", r.content, req),
    ];
    const hard = allIssues.filter(i => !i.includes("警告"));
    const soft = allIssues.filter(i => i.includes("警告"));
    return hard.length === 0 && soft.length > 0;
  });
  if (zhOnlyWarn.length > 0) {
    console.log(`\n--- zh キー欠落のみ (ソフト警告・クラッシュには至らない): ${zhOnlyWarn.length} 件 ---`);
    for (const r of zhOnlyWarn) {
      console.log(`  ⚠️  ${r.slug}  (${r.is_published ? "公開" : "非公開"})`);
    }
  }

  // プレースホルダー本文チェック（公開記事のみ）
  const publishedRows = rows.filter(r => r.is_published);
  const phFindings: Array<{ slug: string; langs: { lang: string; reason: string }[] }> = [];
  for (const r of publishedRows) {
    const c = r.content as Record<string, string> | null;
    if (!c) continue;
    const langs: { lang: string; reason: string }[] = [];
    for (const lang of ["en", "zh"] as const) {
      // locales 配列にその言語が含まれる場合は一次コンテンツなので除外
      if (r.locales && (r.locales as string[]).includes(lang)) continue;
      const reason = isPlaceholderContent(c[lang]);
      if (reason) langs.push({ lang, reason });
    }
    if (langs.length > 0) phFindings.push({ slug: r.slug, langs });
  }
  if (phFindings.length > 0) {
    console.log(`\n--- プレースホルダー本文 (公開記事・en/zh): ${phFindings.length} 件 ---`);
    for (const f of phFindings) {
      console.log(`\n  ⚠️  ${f.slug}`);
      for (const { lang, reason } of f.langs) {
        console.log(`    [${lang}] ${reason}`);
      }
    }
  } else {
    console.log("\n✅ プレースホルダー本文なし（公開記事 en/zh 全チェック通過）");
  }

  // 参考資料セクション個数チェック（visa-* 記事のみ・1個以外はflag）
  // simulator・一般ブログは参考資料セクション不要のため対象外
  const visaRows = publishedRows.filter(r => r.slug.startsWith("visa-"));
  const refCountFindings: Array<{ slug: string; langs: { lang: string; count: number }[] }> = [];
  for (const r of visaRows) {
    const c = r.content as Record<string, string> | null;
    if (!c) continue;
    const langs: { lang: string; count: number }[] = [];
    for (const lang of ["ja", "en", "zh"] as const) {
      const text = c[lang];
      if (!text || text.trim().length < 200) continue; // 実質コンテンツなしはスキップ
      const count = (text.match(/###\s*(?:参考資料|References|参考资料)/g) ?? []).length;
      if (count !== 1) langs.push({ lang, count });
    }
    if (langs.length > 0) refCountFindings.push({ slug: r.slug, langs });
  }
  if (refCountFindings.length > 0) {
    console.log(`\n--- 参考資料セクション個数異常 (visa-* 公開記事・1個以外): ${refCountFindings.length} 件 ---`);
    for (const f of refCountFindings) {
      console.log(`\n  ❌ ${f.slug}`);
      for (const { lang, count } of f.langs) {
        console.log(`    [${lang}] ${count}個 (期待値: 1)`);
      }
    }
  } else {
    console.log(`\n✅ 参考資料セクション個数正常（visa-* 公開記事 ${visaRows.length}件 全ロケール 1個）`);
  }

  // ─── 参考資料セクション内の生URL行検出（全公開記事）────────────────────────────
  // `- https://...` のまま [label](url) に変換されていない行
  const rawRefLineRe = /^-\s+https?:\/\/\S+/m;
  const rawRefFindings: Array<{ slug: string; langs: { lang: string; lines: string[] }[] }> = [];
  for (const r of publishedRows) {
    const c = r.content as Record<string, string> | null;
    if (!c) continue;
    const langs: { lang: string; lines: string[] }[] = [];
    for (const lang of ["ja", "en", "zh"] as const) {
      const text = c[lang];
      if (!text || text.trim().length < 200) continue;
      // 参考資料セクションを抽出
      const refIdx = text.search(/###\s*(?:参考資料|References|参考资料)/);
      const refSection = refIdx >= 0 ? text.slice(refIdx) : "";
      if (!refSection) continue;
      // 生URL行 = `- https://` 形式で [label]( で始まっていない行
      const lines = refSection.split("\n").filter(l => {
        const t = l.trim();
        return t.match(/^-\s+https?:\/\//) && !t.match(/^-\s+\[[^\]]+\]\(https?:/);
      });
      if (lines.length > 0) langs.push({ lang, lines });
    }
    if (langs.length > 0) rawRefFindings.push({ slug: r.slug, langs });
  }
  if (rawRefFindings.length > 0) {
    console.log(`\n--- 参考資料内生URL行（未リンク化）: ${rawRefFindings.length} 件 ---`);
    for (const f of rawRefFindings) {
      console.log(`\n  ❌ ${f.slug}`);
      for (const { lang, lines } of f.langs) {
        console.log(`    [${lang}] ${lines.length}件`);
        for (const l of lines) console.log(`      ${l.trim()}`);
      }
    }
  } else {
    console.log(`\n✅ 参考資料内生URL行なし（公開記事 ${publishedRows.length}件 全ロケール チェック通過）`);
  }

  // ─── 本文中の生シミュレーターURL検出（全公開記事）─────────────────────────────
  // `https://moveworthapp.com/simulate` が [label](url) の外に露出している
  const rawSimRe = /(?<![(\[])https?:\/\/moveworthapp\.com\/simulate/;
  const rawSimFindings: Array<{ slug: string; langs: string[] }> = [];
  for (const r of publishedRows) {
    const c = r.content as Record<string, string> | null;
    if (!c) continue;
    const langs: string[] = [];
    for (const lang of ["ja", "en", "zh"] as const) {
      const text = c[lang];
      if (!text) continue;
      // 本文部分のみ（参考資料セクション以前）を検査
      const refIdx = text.search(/###\s*(?:参考資料|References|参考资料)/);
      const bodyText = refIdx >= 0 ? text.slice(0, refIdx) : text;
      if (rawSimRe.test(bodyText)) langs.push(lang);
    }
    if (langs.length > 0) rawSimFindings.push({ slug: r.slug, langs });
  }
  if (rawSimFindings.length > 0) {
    console.log(`\n--- 本文中の生シミュレーターURL（未リンク化）: ${rawSimFindings.length} 件 ---`);
    for (const f of rawSimFindings) {
      console.log(`  ❌ ${f.slug}  [${f.langs.join(", ")}]`);
    }
  } else {
    console.log(`\n✅ 本文中の生シミュレーターURLなし（公開記事 ${publishedRows.length}件 チェック通過）`);
  }

  // ─── GPT 拒否・メタテキスト 全文スキャン（blog_posts 全記事・全言語）─────────
  const refusalFindings: Array<{ slug: string; is_published: boolean; hits: { lang: string; patterns: string[] }[] }> = [];
  for (const r of rows) {
    const c = r.content as Record<string, string> | null;
    if (!c) continue;
    const hits: { lang: string; patterns: string[] }[] = [];
    for (const lang of ["ja", "en", "zh"] as const) {
      const text = c[lang];
      if (!text || text.trim().length === 0) continue;
      const patterns = findRefusalPatterns(text);
      if (patterns.length > 0) hits.push({ lang, patterns });
    }
    if (hits.length > 0) refusalFindings.push({ slug: r.slug, is_published: r.is_published, hits });
  }
  if (refusalFindings.length > 0) {
    console.log(`\n--- ❌ GPT拒否・メタテキスト混入（blog_posts 全記事）: ${refusalFindings.length} 件 ---`);
    for (const f of refusalFindings) {
      console.log(`\n  ${f.is_published ? "🔴 公開" : "🟡 draft"} ${f.slug}`);
      for (const { lang, patterns } of f.hits) {
        for (const p of patterns) console.log(`    [${lang}] ${p}`);
      }
    }
  } else {
    console.log(`\n✅ GPT拒否・メタテキスト混入なし（blog_posts ${rows.length}件 全言語スキャン通過）`);
  }

  // ─── study_blog_posts 機械検証（D-4 拡張版）────────────────────────────────
  console.log("\n=== study_blog_posts 機械検証 ===");
  const { data: studyData, error: studyError } = await sb
    .from("study_blog_posts")
    .select("slug, is_published, content")
    .order("slug");
  if (studyError) {
    console.error("study_blog_posts 取得エラー:", studyError.message);
  } else {
    const studyRows = studyData ?? [];
    const publishedStudy = studyRows.filter(r => r.is_published);

    // 1. zh 未生成チェック（公開記事のみ）
    const zhMissing = publishedStudy.filter(r => {
      const c = r.content as Record<string, string> | null;
      return !c?.zh || c.zh.trim() === "";
    });
    if (zhMissing.length > 0) {
      console.log(`❌ zh 未生成（公開記事）: ${zhMissing.length} 件`);
      zhMissing.forEach(r => console.log(`  - ${r.slug}`));
    } else {
      console.log(`✅ zh 全生成済み（公開記事 ${publishedStudy.length}件）`);
    }

    // 2. zh 品質チェック（公開記事）：分量・JA比率・見出し数
    const zhQcFindings: Array<{ slug: string; issues: string[] }> = [];
    for (const r of publishedStudy) {
      const c = r.content as Record<string, string> | null;
      if (!c?.zh || c.zh.trim() === "") continue;
      const zh = c.zh;
      const ja = c.ja ?? "";
      const issues: string[] = [];
      if (zh.length < 300) issues.push(`短すぎ: ${zh.length}字`);
      if (ja.length > 0 && zh.length < ja.length * 0.3) issues.push(`JA比率低: zh=${zh.length} ja=${ja.length}`);
      const jaH = (ja.match(/^###\s/gm) ?? []).length;
      const zhH = (zh.match(/^###\s/gm) ?? []).length;
      if (jaH > 0 && Math.abs(jaH - zhH) > 2) issues.push(`見出し数差大: ja=${jaH} zh=${zhH}`);
      if (issues.length > 0) zhQcFindings.push({ slug: r.slug, issues });
    }
    if (zhQcFindings.length > 0) {
      console.log(`❌ zh 品質チェック失敗（公開記事）: ${zhQcFindings.length} 件`);
      for (const f of zhQcFindings) console.log(`  ${f.slug}: ${f.issues.join(", ")}`);
    } else {
      console.log(`✅ zh 品質チェック通過（公開記事 ${publishedStudy.length}件）`);
    }

    // 3. example.com 混入チェック（全記事・全言語）
    const exampleFindings: Array<{ slug: string; langs: string[] }> = [];
    for (const r of studyRows) {
      const c = r.content as Record<string, string> | null;
      if (!c) continue;
      const langs = (["ja", "en", "zh"] as const).filter(l => c[l]?.includes("example.com"));
      if (langs.length > 0) exampleFindings.push({ slug: r.slug, langs });
    }
    if (exampleFindings.length > 0) {
      console.log(`❌ example.com 混入: ${exampleFindings.length} 件`);
      for (const f of exampleFindings) console.log(`  ${f.slug} [${f.langs.join(", ")}]`);
    } else {
      console.log(`✅ example.com 混入なし（study_blog_posts ${studyRows.length}件）`);
    }

    // 4. GPT拒否・メタテキスト スキャン（全言語：ja/en/zh）
    const studyRefusalFindings: Array<{ slug: string; is_published: boolean; hits: { lang: string; patterns: string[] }[] }> = [];
    for (const r of studyRows) {
      const c = r.content as Record<string, string> | null;
      if (!c) continue;
      const hits: { lang: string; patterns: string[] }[] = [];
      for (const lang of ["ja", "en", "zh"] as const) {
        const text = c[lang];
        if (!text || text.trim().length === 0) continue;
        const patterns = findRefusalPatterns(text);
        if (patterns.length > 0) hits.push({ lang, patterns });
      }
      if (hits.length > 0) studyRefusalFindings.push({ slug: r.slug, is_published: r.is_published, hits });
    }
    if (studyRefusalFindings.length > 0) {
      console.log(`❌ GPT拒否・メタテキスト混入: ${studyRefusalFindings.length} 件`);
      for (const f of studyRefusalFindings) {
        console.log(`\n  ${f.is_published ? "🔴 公開" : "🟡 draft"} ${f.slug}`);
        for (const { lang, patterns } of f.hits) {
          for (const p of patterns) console.log(`    [${lang}] ${p}`);
        }
      }
    } else {
      console.log(`✅ GPT拒否・メタテキスト混入なし（study_blog_posts ${studyRows.length}件 全言語スキャン通過）`);
    }
  }

  console.log("\n=== 完了 ===");
  const hasErrors = broken.length > 0 || refCountFindings.length > 0
    || rawRefFindings.length > 0 || rawSimFindings.length > 0 || refusalFindings.length > 0;
  process.exit(hasErrors ? 1 : 0);
}

main().catch(console.error);
