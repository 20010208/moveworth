/**
 * GitHub Issue の重複防止・source単位通知で共有するユーティリティ。
 *
 * fail-closed方針: Search/Issue作成/コメント追加のいずれも、GitHub API呼び出しが
 * 非2xx・incomplete_results=true・不正JSON・スキーマ不正の場合は必ずthrowする。
 * 「既存Issueが見つからなかった」ことと「検索できなかった/レスポンスを信頼できなかった」ことを
 * 絶対に混同しない（後者を前者として扱うと、API障害時に重複Issueを量産するfail-open状態になるため）。
 * `{}` や `items` 欠落等の不完全なレスポンスも「既存Issueなし」とは扱わずthrowする。
 */
import { createHash } from "crypto";

export class GitHubIssueApiError extends Error {}

export function normalizeUrlForHash(url: string): string {
  return url.trim().toLowerCase().replace(/\/+$/, "");
}

export function shortUrlHash(url: string): string {
  return createHash("sha256").update(normalizeUrlForHash(url), "utf-8").digest("hex").slice(0, 8);
}

/** 安定キー: country_sources.id があればそれを優先し、なければ正規化URLのハッシュを使う */
export function stableSourceKey(id: string | null | undefined, url: string): string {
  if (id) return `source:${id}`;
  return `url:${shortUrlHash(url)}`;
}

export type GhConfig = { token: string; repo: string };

async function ghFetch(url: string, init: RequestInit, cfg: GhConfig): Promise<Response> {
  return fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${cfg.token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
      ...((init.headers as Record<string, string>) ?? {}),
    },
  });
}

async function parseJson(res: Response, label: string): Promise<unknown> {
  try {
    return await res.json();
  } catch (e) {
    throw new GitHubIssueApiError(`${label}のJSON解析失敗: ${(e as Error).message}`);
  }
}

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function isPositiveInt(v: unknown): v is number {
  return typeof v === "number" && Number.isInteger(v) && v > 0;
}

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.length > 0;
}

// total_countは非負整数かつGitHub Search APIの上限（1000）以下であることを要求する。
// Number.isInteger()はNaN・Infinity・小数のいずれも自動的にfalseを返すため、
// 「NaN、小数、負数、Infiniteを拒否」の要件をこの1関数で満たす。
function isValidTotalCount(v: unknown): v is number {
  return typeof v === "number" && Number.isInteger(v) && v >= 0 && v <= SEARCH_MAX_ITEMS;
}

export type IssueRef = { number: number; url: string };

// ===== Search API =====

type ValidatedSearchItem = { number: number; title: string; html_url: string };

function validateSearchItem(raw: unknown): ValidatedSearchItem {
  if (!isPlainObject(raw)) {
    throw new GitHubIssueApiError("Search item がobjectではありません");
  }
  if (!isPositiveInt(raw.number)) {
    throw new GitHubIssueApiError(`Search item.number が正の整数ではありません: ${JSON.stringify(raw.number)}`);
  }
  if (typeof raw.title !== "string") {
    throw new GitHubIssueApiError("Search item.title がstringではありません");
  }
  if (!isNonEmptyString(raw.html_url)) {
    throw new GitHubIssueApiError("Search item.html_url が空です");
  }
  // type:issue で絞り込んでいても、PRが混入した場合は既存Issue判定を汚染するためfail-closedにする
  if ("pull_request" in raw && raw.pull_request != null) {
    throw new GitHubIssueApiError(`Search itemがpull requestです（number=${raw.number}）`);
  }
  return { number: raw.number, title: raw.title, html_url: raw.html_url };
}

const SEARCH_MAX_ITEMS = 1000; // GitHub Search APIの仕様上の上限（これを超えると完全性を保証できない）
const SEARCH_PER_PAGE = 100;

/**
 * open issueをタイトル完全一致で検索する。API失敗・不正応答・スキーマ不正・ページング不整合は
 * 必ずthrowする（fail-closed）。「見つからなかった」と「完全に検索できなかった」を絶対に混同しない。
 *
 * 各ページで検証する内容:
 *   - total_countが0以上1000以下の整数であること（NaN・小数・負数・Infinity・欠落は拒否）
 *   - total_countが全ページで同一であること
 *   - itemsが配列かつ1ページあたり最大per_page(100)件であること
 *   - total_count=0なのにitemsがある／total_count>0なのに空ページ、を矛盾として拒否
 *   - 取得済み件数がtotal_countを超えない
 *   - 同一ページ内・ページ間でIssue番号が重複しない
 * 全ページ取得完了後、収集件数がtotal_countと完全一致した場合のみタイトル完全一致判定を行う。
 */
export async function searchOpenIssueByExactTitle(title: string, cfg: GhConfig): Promise<IssueRef | null> {
  const q = `repo:${cfg.repo} type:issue state:open in:title "${title}"`;
  const collected: ValidatedSearchItem[] = [];
  const seenNumbers = new Set<number>();
  let page = 1;
  let totalCount: number | null = null;

  while (true) {
    const res = await ghFetch(
      `https://api.github.com/search/issues?q=${encodeURIComponent(q)}&per_page=${SEARCH_PER_PAGE}&page=${page}`,
      { method: "GET" },
      cfg
    );
    if (!res.ok) {
      throw new GitHubIssueApiError(`GitHub Search API失敗: ${res.status} ${await res.text()}`);
    }
    const data = await parseJson(res, "GitHub Search API");
    if (!isPlainObject(data)) {
      throw new GitHubIssueApiError("GitHub Search APIレスポンスがobjectではありません（{}等の不完全な応答を既存なしと扱わない）");
    }
    if (!isValidTotalCount(data.total_count)) {
      throw new GitHubIssueApiError(
        `GitHub Search APIレスポンスのtotal_countが不正です: ${JSON.stringify(data.total_count)}（0以上${SEARCH_MAX_ITEMS}以下の整数である必要があります）`
      );
    }
    if (typeof data.incomplete_results !== "boolean") {
      throw new GitHubIssueApiError("GitHub Search APIレスポンスのincomplete_resultsがbooleanではありません");
    }
    if (data.incomplete_results) {
      // incomplete_results=true は「見つからなかった」ではなく「検索が不完全」を意味するため、
      // 誤って「既存なし」と判定して重複Issueを作らないよう例外にする
      throw new GitHubIssueApiError("GitHub Search APIがincomplete_results=trueを返しました");
    }
    if (!Array.isArray(data.items)) {
      throw new GitHubIssueApiError("GitHub Search APIレスポンスのitemsが配列ではありません（items欠落を既存なしと扱わない）");
    }
    if (data.items.length > SEARCH_PER_PAGE) {
      throw new GitHubIssueApiError(
        `GitHub Search APIが1ページあたり${SEARCH_PER_PAGE}件を超えるitemsを返しました: ${data.items.length}件（page=${page}）`
      );
    }

    if (page === 1) {
      totalCount = data.total_count;
    } else if (data.total_count !== totalCount) {
      throw new GitHubIssueApiError(
        `GitHub Search APIのtotal_countがページ間で変化しました（page1=${totalCount}, page${page}=${data.total_count}）`
      );
    }

    if (totalCount === 0 && data.items.length > 0) {
      throw new GitHubIssueApiError(`total_count=0にも関わらずitemsが${data.items.length}件返されました（page=${page}）`);
    }
    if (data.items.length === 0 && collected.length < totalCount) {
      throw new GitHubIssueApiError(
        `total_count=${totalCount}に到達する前に空ページを受け取りました（取得済み${collected.length}件、page=${page}）`
      );
    }

    const items = data.items.map(validateSearchItem);

    // 同一ページ内の重複チェック
    const pageNumbers = new Set<number>();
    for (const it of items) {
      if (pageNumbers.has(it.number)) {
        throw new GitHubIssueApiError(`同一ページ内でIssue番号が重複しました: #${it.number}（page=${page}）`);
      }
      pageNumbers.add(it.number);
    }
    // ページ間の重複チェック
    for (const it of items) {
      if (seenNumbers.has(it.number)) {
        throw new GitHubIssueApiError(`ページ間でIssue番号が重複しました: #${it.number}（page=${page}）`);
      }
      seenNumbers.add(it.number);
    }

    collected.push(...items);

    if (collected.length > totalCount) {
      throw new GitHubIssueApiError(`取得済み件数(${collected.length})がtotal_count(${totalCount})を超えました`);
    }

    if (collected.length === totalCount) break; // 全件取得完了
    page++;
  }

  // ループはcollected.length===totalCountで抜けるため、ここでの不一致は本来到達しない防御的チェック
  if (totalCount === null || collected.length !== totalCount) {
    throw new GitHubIssueApiError(
      `検索結果の取得件数(${collected.length})がtotal_count(${totalCount})と一致しません`
    );
  }

  const exact = collected.find((i) => i.title === title);
  return exact ? { number: exact.number, url: exact.html_url } : null;
}

// ===== Issue作成API =====

function validateCreatedIssue(raw: unknown, expectedTitle: string): IssueRef {
  if (!isPlainObject(raw)) {
    throw new GitHubIssueApiError("Issue作成レスポンスがobjectではありません");
  }
  if (!isPositiveInt(raw.number)) {
    throw new GitHubIssueApiError(`Issue作成レスポンスのnumberが正の整数ではありません: ${JSON.stringify(raw.number)}`);
  }
  if (!isNonEmptyString(raw.html_url)) {
    throw new GitHubIssueApiError("Issue作成レスポンスのhtml_urlが空です");
  }
  if (typeof raw.title !== "string") {
    throw new GitHubIssueApiError("Issue作成レスポンスのtitleがstringではありません");
  }
  // Issue作成自体はAPI上成功（2xx）していても、返ってきたtitleが要求と食い違う場合は
  // 呼び出し側から見て何が作成されたか信頼できないため成功扱いにしない
  if (raw.title !== expectedTitle) {
    throw new GitHubIssueApiError(
      `Issue作成レスポンスのtitleが要求と一致しません: expected=${JSON.stringify(expectedTitle)} actual=${JSON.stringify(raw.title)}`
    );
  }
  return { number: raw.number, url: raw.html_url };
}

export async function createIssue(title: string, body: string, labels: string[], cfg: GhConfig): Promise<IssueRef> {
  const res = await ghFetch(
    `https://api.github.com/repos/${cfg.repo}/issues`,
    { method: "POST", body: JSON.stringify({ title, body, labels }) },
    cfg
  );
  if (!res.ok) {
    throw new GitHubIssueApiError(`Issue作成失敗: ${res.status} ${await res.text()}`);
  }
  const data = await parseJson(res, "Issue作成レスポンス");
  return validateCreatedIssue(data, title);
}

// ===== コメントAPI =====

function validateComment(raw: unknown): void {
  if (!isPlainObject(raw)) {
    throw new GitHubIssueApiError("コメント作成レスポンスがobjectではありません");
  }
  if (!isPositiveInt(raw.id)) {
    throw new GitHubIssueApiError(`コメント作成レスポンスのidが正の整数ではありません: ${JSON.stringify(raw.id)}`);
  }
  if (!isNonEmptyString(raw.html_url)) {
    throw new GitHubIssueApiError("コメント作成レスポンスのhtml_urlが空です");
  }
}

export async function addIssueComment(issueNumber: number, body: string, cfg: GhConfig): Promise<void> {
  const res = await ghFetch(
    `https://api.github.com/repos/${cfg.repo}/issues/${issueNumber}/comments`,
    { method: "POST", body: JSON.stringify({ body }) },
    cfg
  );
  if (!res.ok) {
    throw new GitHubIssueApiError(`Issueコメント追加失敗: ${res.status} ${await res.text()}`);
  }
  const data = await parseJson(res, "コメント作成レスポンス");
  validateComment(data);
}
