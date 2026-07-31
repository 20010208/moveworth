/**
 * GitHub Issue の重複防止・source単位通知で共有するユーティリティ。
 *
 * fail-closed方針: Search/Issue作成/コメント追加のいずれも、GitHub API呼び出しが
 * 非2xx・incomplete_results=true・不正JSONの場合は必ずthrowする。
 * 「既存Issueが見つからなかった」ことと「検索できなかった」ことを絶対に混同しない
 * （後者を前者として扱うと、API障害時に重複Issueを量産するfail-open状態になるため）。
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

export type IssueRef = { number: number; url: string };

/** open issueをタイトル完全一致で検索する。API失敗・不正応答は必ずthrowする（fail-closed）。 */
export async function searchOpenIssueByExactTitle(title: string, cfg: GhConfig): Promise<IssueRef | null> {
  const q = `repo:${cfg.repo} type:issue state:open in:title "${title}"`;
  const res = await ghFetch(`https://api.github.com/search/issues?q=${encodeURIComponent(q)}`, { method: "GET" }, cfg);
  if (!res.ok) {
    throw new GitHubIssueApiError(`GitHub Search API失敗: ${res.status} ${await res.text()}`);
  }
  let data: unknown;
  try {
    data = await res.json();
  } catch (e) {
    throw new GitHubIssueApiError(`GitHub Search APIのJSON解析失敗: ${(e as Error).message}`);
  }
  const d = data as { incomplete_results?: boolean; items?: { number: number; title: string; html_url: string }[] };
  if (d.incomplete_results) {
    // incomplete_results=true は「見つからなかった」ではなく「検索が不完全」を意味するため、
    // 誤って「既存なし」と判定して重複Issueを作らないよう例外にする
    throw new GitHubIssueApiError("GitHub Search APIがincomplete_results=trueを返しました");
  }
  const exact = (d.items ?? []).find((i) => i.title === title);
  return exact ? { number: exact.number, url: exact.html_url } : null;
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
  const issue = (await res.json()) as { number: number; html_url: string };
  return { number: issue.number, url: issue.html_url };
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
}
