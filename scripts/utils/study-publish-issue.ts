/**
 * study country/work の scheduled publisher が品質NG候補を通知するための
 * GitHub Issue生成ロジック（scheduler運用方針 Option C）。
 *
 * 実際のSearch/Issue作成/コメント追加はすべて scripts/utils/github-issue-dedup.ts
 * （fail-closed実装）へ委譲する。ここでは study-publish固有の
 * stable title / body 組み立てのみを担当する。
 *
 * 重複防止: slugを含む安定タイトルで完全一致検索し、
 *   - 同slugのOPEN Issueがあればコメント追加（新規作成しない）
 *   - OPENが無ければ（CLOSEDのみ、または存在しない）新規作成する
 * Issue API呼び出し自体の失敗（検索・作成・コメントいずれも）はthrowし、
 * 呼び出し側で「品質NG」とは区別して system error として扱わせる。
 */
import {
  searchOpenIssueByExactTitle,
  createIssue,
  addIssueComment,
  type GhConfig,
} from "./github-issue-dedup";

export type BlockedCandidate = {
  slug: string;
  category: "country" | "work";
  countryCode: string;
  reasons: string[];
  approvedSourceCount: number;
  refUrlCounts: { ja: number; en: number; zh: number };
};

export function buildBlockedIssueTitle(slug: string): string {
  return `[study-publish][slug:${slug}] publication blocked`;
}

function buildBlockedIssueBody(c: BlockedCandidate, situation: "new" | "recurring", runUrl: string): string {
  return [
    situation === "new"
      ? "## study記事の自動公開が品質チェックでブロックされました"
      : "## 品質チェックで再度ブロックされました（既存Issueへの追記）",
    "",
    `- slug: ${c.slug}`,
    `- category: ${c.category}`,
    `- country code: ${c.countryCode.toUpperCase()}`,
    `- quality failure reasons:`,
    ...c.reasons.map((r) => `  - ${r}`),
    `- approved source count: ${c.approvedSourceCount}`,
    `- references URL count: ja=${c.refUrlCounts.ja} / en=${c.refUrlCounts.en} / zh=${c.refUrlCounts.zh}`,
    `- detected_at: ${new Date().toISOString()}`,
    `- run: ${runUrl}`,
    "",
    "**action required:**",
    "1. country_sources に不足しているapproved source（purpose: study/visa, status: alive）を登録する",
    "2. 記事の参考資料sectionをapproved sourceへ差し替える",
    "3. 修正後、`--publish-only` または既存の手動publish経路で明示的に再検証・公開する（自動retryは行われない）",
  ].join("\n");
}

/**
 * 品質NG candidateをGitHub Issueで通知する。
 * 同slugのOPEN Issueが既にあればコメント追加、なければ新規作成する。
 * 検索・作成・コメントいずれかのAPI呼び出しが失敗した場合はthrowする
 * （呼び出し側で system error として処理すること。品質NGとは混同しない）。
 */
export async function notifyBlockedCandidate(c: BlockedCandidate, cfg: GhConfig, runUrl: string): Promise<IssueNotifyResult> {
  const title = buildBlockedIssueTitle(c.slug);
  const existing = await searchOpenIssueByExactTitle(title, cfg);
  if (existing) {
    await addIssueComment(existing.number, buildBlockedIssueBody(c, "recurring", runUrl), cfg);
    return { action: "commented", issueNumber: existing.number };
  }
  const created = await createIssue(title, buildBlockedIssueBody(c, "new", runUrl), ["bug", "content"], cfg);
  return { action: "created", issueNumber: created.number };
}

export type IssueNotifyResult = { action: "created" | "commented"; issueNumber: number };
