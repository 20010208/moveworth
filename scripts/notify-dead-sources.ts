/**
 * verify-country-sources.ts が書き出す .tmp/country-source-health/dead-sources.json を読み、
 * source単位（country_sources.id、なければ正規化URLのハッシュ）でGitHub Issueへ通知する。
 *
 * - 同一sourceのopen issueがなければ新規作成
 * - 同一sourceのopen issueがあればコメント追加（新規Issueは作らない）
 * - closed issueは新規作成を妨げない（fail-closedの検索が open のみを対象にするため自然に満たされる）
 * - GitHub Search/Issue作成/コメントAPIの失敗はfail-closed（該当sourceを失敗として記録し、
 *   最終的に非ゼロ終了する。「検索できない」を「既存なし」として扱わない）
 */
import { existsSync, readFileSync } from "fs";
import {
  stableSourceKey,
  searchOpenIssueByExactTitle,
  createIssue,
  addIssueComment,
} from "./utils/github-issue-dedup";

const DEAD_REPORT_PATH = ".tmp/country-source-health/dead-sources.json";

const GH_TOKEN = process.env.GH_TOKEN ?? process.env.GITHUB_TOKEN ?? "";
const GH_REPO = process.env.GH_REPO ?? process.env.GITHUB_REPOSITORY ?? "";
const RUN_URL =
  process.env.GITHUB_SERVER_URL && process.env.GITHUB_REPOSITORY && process.env.GITHUB_RUN_ID
    ? `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`
    : "unknown";

type DeadSourceEntry = {
  id: string | null;
  countryCode: string;
  category: string;
  url: string;
  reason: string;
  checkedAt: string;
};

function buildTitle(entry: DeadSourceEntry): string {
  return `[country-sources][${stableSourceKey(entry.id, entry.url)}] dead URL`;
}

function buildBody(entry: DeadSourceEntry, situation: "new" | "recurring"): string {
  return [
    situation === "new"
      ? "## country_sources ヘルスチェックで dead URL を検出しました"
      : "## 再検証でも dead URL のままでした",
    "",
    `- country: ${entry.countryCode.toUpperCase()}`,
    `- category: ${entry.category}`,
    `- URL: ${entry.url}`,
    `- reason: ${entry.reason}`,
    `- checked at: ${entry.checkedAt}`,
    `- run: ${RUN_URL}`,
    "",
    "**対応手順:**",
    "1. 上記URLの生存状況を確認",
    "2. 置換URLを特定して `country_sources` を `source=manual` で更新",
    "3. 該当記事の参考文献欄を差し替え",
  ].join("\n");
}

export async function notifyAll(entries: DeadSourceEntry[]): Promise<{ succeeded: number; failed: string[] }> {
  if (!GH_TOKEN || !GH_REPO) {
    throw new Error("GH_TOKEN / GH_REPO が未設定です（fail-closedのため通知処理を中断します）");
  }
  const cfg = { token: GH_TOKEN, repo: GH_REPO };
  let succeeded = 0;
  const failed: string[] = [];

  for (const entry of entries) {
    const title = buildTitle(entry);
    try {
      const existing = await searchOpenIssueByExactTitle(title, cfg);
      if (existing) {
        await addIssueComment(existing.number, buildBody(entry, "recurring"), cfg);
        console.log(`  既存Issue #${existing.number} へコメント追加: ${title}`);
      } else {
        const created = await createIssue(title, buildBody(entry, "new"), ["bug", "content"], cfg);
        console.log(`  新規Issue作成 #${created.number}: ${title}`);
      }
      succeeded++;
    } catch (e) {
      console.error(`  ❌ 通知失敗: ${title}: ${(e as Error).message}`);
      failed.push(title);
    }
  }
  return { succeeded, failed };
}

async function main() {
  if (!existsSync(DEAD_REPORT_PATH)) {
    console.log(`${DEAD_REPORT_PATH} が存在しません。dead URLなし、または検証が未完了として通知をスキップします。`);
    return;
  }
  const raw = readFileSync(DEAD_REPORT_PATH, "utf-8");
  const entries = JSON.parse(raw) as DeadSourceEntry[];
  if (entries.length === 0) {
    console.log("dead URLは0件のため通知をスキップします。");
    return;
  }

  console.log(`=== dead URL ${entries.length}件を通知します ===\n`);
  const { succeeded, failed } = await notifyAll(entries);

  console.log(`\n=== 結果 === 成功: ${succeeded}件 / 失敗: ${failed.length}件`);
  if (failed.length > 0) {
    console.error("失敗した対象:");
    failed.forEach((t) => console.error(`  - ${t}`));
    process.exitCode = 1;
  }
}

if (require.main === module) {
  main().catch((e) => {
    console.error("❌", e.message ?? e);
    process.exitCode = 1;
  });
}
