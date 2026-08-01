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
 * open issueをタイトル完全一致で検索する。API失敗・不正応答・スキーマ不正は必ずthrowする（fail-closed）。
 * per_page=100で明示的にページングし、total_countに対して取得しきれない場合や
 * GitHub Search APIの上限（1000件）に達し完全性を保証できない場合もthrowする。
 */
export async function searchOpenIssueByExactTitle(title: string, cfg: GhConfig): Promise<IssueRef | null> {
  const q = `repo:${cfg.repo} type:issue state:open in:title "${title}"`;
  const collected: ValidatedSearchItem[] = [];
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
    if (typeof data.total_count !== "number") {
      throw new GitHubIssueApiError("GitHub Search APIレスポンスにtotal_countがありません");
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

    const items = data.items.map(validateSearchItem);
    if (totalCount === null) totalCount = data.total_count;
    collected.push(...items);

    if (items.length === 0) break; // これ以上ページがない
    if (collected.length >= totalCount) break; // 全件取得完了
    if (collected.length >= SEARCH_MAX_ITEMS) {
      throw new GitHubIssueApiError(
        `GitHub Search APIの上限（${SEARCH_MAX_ITEMS}件）に達し、検索結果の完全性を保証できません`
      );
    }
    page++;
  }

  const exact = collected.find((i) => i.title === title);
  return exact ? { number: exact.number, url: exact.html_url } : null;
}

// ===== Issue作成API =====

function validateCreatedIssue(raw: unknown): IssueRef {
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
  return validateCreatedIssue(data);
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
