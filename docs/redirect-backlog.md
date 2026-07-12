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

---

## country_sources 登録保留 — 税務当局 URL

### TN（チュニジア）— tia.gov.tn/en/tax_system が SSL証明書エラー
- **URL**: `https://guide.tia.gov.tn/en/tax_system`
- **問題**: サーバーが TLS 証明書エラー（期限切れ / 証明書不一致）を返し機械検証不可
- **対応**: 証明書が修正されたら `seed-tax-sources-batch1.ts` に追加して再登録
- **追加日**: 2026-07-13

### DE（ドイツ）— 公式英語税制情報が PDF のみ
- **URL**: `https://www.bundesfinanzministerium.de/` 系
- **問題**: 英語税制情報は PDF 形式のみ。静的 HTML の一次情報ページが存在しない
- **代替候補**: `https://www.bundesregierung.de/breg-en/service/tax`（未確認）
- **対応**: 英語 HTML ページが整備されるまで visa-de 税制セクションは「公式情報でご確認ください」誘導のまま
- **追加日**: 2026-07-13

---

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
