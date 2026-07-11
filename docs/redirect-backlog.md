# Redirect Backlog — casestudy → simulator

casestudy記事を非公開化した際、対応するシミュレーター記事が未公開のため
301リダイレクトを保留している記事の管理リスト。

各行の「対応シミュレーター記事のslug」が生成・公開されたら
`next.config.ts` の `redirects()` に追記し、本リストから削除する。

## 対応待ちリスト

| casestudy slug | 国 | 属性・テーマ | 対応simulator slug（予定） | 追加日 |
|---|---|---|---|---|
| `moving-to-kuala-lumpur-a-familys-cost-of-living-breakdo-2026` | MY | 家族（夫婦＋子ども） | `simulator-my-couple-2026` or `simulator-my-mgr-couple-2026` | 2026-07-12 |
| `freelancers-guide-to-moving-to-barcelona-one-year-in-re-2026` | ES | フリーランサー（単身） | `simulator-es-eng-single-2026` | 2026-07-12 |
| `a-40s-couples-guide-to-moving-to-lisbon-costs-taxes-and-2026` | PT | 40代夫婦・FIRE / NHR税制 | `simulator-pt-mgr-couple-2026` | 2026-07-12 |
| `vancouver-relocation-for-it-engineers-a-comprehensive-g-2026` | CA | ITエンジニア（単身） | `simulator-ca-eng-single-2026` | 2026-07-12 |
| `japanese-engineers-experience-moving-to-bangkok-2026` | TH | ITエンジニア（単身） | `simulator-th-eng-single-2026` | 2026-07-12 |

## 追加不要リスト（リダイレクト先なし）

| casestudy slug | 理由 |
|---|---|
| `why-i-chose-to-move-abroad-in-my-30s-and-how-i-prepared-2026` | 特定国なし（汎用移住ガイド）、simulator記事との対応なし |

## 実施済みリダイレクト（参考）

| source | destination | 実施日 |
|---|---|---|
| `/blog/building-wealth-a-case-study-of-a-30s-couple-moving-to-2026` | `/blog/simulator-sg-couple-2026` | 2026-07-12 |
| `/blog/building-wealth-a-case-study-of-a-dual-income-couple-in-2026` | `/blog/simulator-sg-couple-2026` | 2026-07-12 |
| `/blog/entrepreneurs-moving-to-dubai-tax-savings-living-costs-2026` | `/blog/simulator-ae-eng-single-2026` | 2026-07-12 |

## redirect追加手順

1. `next.config.ts` の `redirects()` 配列に以下を追記：
   ```ts
   {
     source: "/blog/<casestudy-slug>",
     destination: "/blog/<simulator-slug>",
     permanent: true,
   },
   ```
2. 本ファイルの「対応待ちリスト」から該当行を削除し、「実施済み」に移動
3. commit & push（Vercel自動デプロイ）
