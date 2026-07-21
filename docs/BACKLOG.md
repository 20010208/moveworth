# MoveWorth Backlog

最終更新: 2026-07-21

> 本ファイルはプロジェクト全体の未完了タスクを管理する。
> `docs/redirect-backlog.md` はリダイレクト専用として別管理する。
> 以下は2026-07-21時点の引き継ぎサマリーから移行した項目であり、着手前に実コード・DB・最新状況を再確認すること。

## BL-20260721-01: C-5給与・生活費grounding（Group B実データ取得）

- 優先度: 中
- 状態: 進行中（CA/AU/CH完了、NZ/KR/US未着手）
- 関連領域: country_presets / industry-salaries / living cost
- 現状:
  - グループA全19カ国（パイロット5カ国 + Batch 2〜4の14カ国）は完了
  - GB/JP完了（ASHE 2023/MHLW令和5年実測値反映済み）
  - CA/AU/CH完了。CA/AUは9業種を公式統計値へ更新、CHは取得可能なinfrastructureのみ更新
  - CA/CH生活費は公式分類不足、AU生活費は成人換算係数非公開のため取得不可として現行値を維持
  - 残りNZ/KR/USは未着手
  - ブロッカー: KR（SSO認証）、US（BLS 403）は別ルート調査が必要。
- 完了条件: 残り3カ国（NZ/KR/US）について9業種の実測値を一次情報から取得し、採用値・対象条件・出典・取得処理が追跡可能であること

## BL-20260721-02: BG / CY一次情報URLの再調査

- 優先度: 低〜中
- 状態: 保留
- 関連領域: country_sources
- 前提・ブロッカー: 既知URLが404または接続不能
- 完了条件: 政府・官報・公式法令DB等の到達可能な本文ページを確保し登録

## BL-20260721-03: study-country-tr 中国語取りこぼし確認

- 優先度: 中
- 状態: 完了
- 関連領域: study_blog_posts
- 現状: `study-country-tr`のtitle.zh / description.zhを補完済み。content.zh 1127字とis_published=trueは不変、対象外112件の変更0件を確認。
- 前提・ブロッカー: 解消済み。ユーザー承認により公開状態を維持した対象限定更新を実施。
- 完了条件: content.zh / title.zh / description.zhの存在、公開状態不変、対象外更新0件を確認

## BL-20260721-04: 部分更新機能の汎用化

- 優先度: 中
- 状態: 未着手
- 関連領域: 生成・修正スクリプト
- 前提・ブロッカー: force-regenerateによる情報欠落事故を回避する設計
- 完了条件: 税率等の指定セクションだけを安全に更新でき、他フィールド不変を機械検証できる

## BL-20260721-05: visa-guide第2弾の公式ソース確保

- 優先度: 低〜中
- 状態: 保留
- 関連領域: visa-guide
- 対象候補: PT / ES / DE / IT
- 前提・ブロッカー: 政府公式の英語または現地語本文ソース
- 完了条件: 公式ソース確保後、draft生成・レビュー・publish-onlyの順で対応

## BL-20260721-06: study側の機械検証基盤強化

- 優先度: 中
- 状態: 未着手
- 関連領域: study_blog_posts / scripts
- 前提・ブロッカー: blog_posts側との検証機能差
- 完了条件: 構造、拒否パターン、URL重複、生URL、参照ラベル等を横断検証できる

## BL-20260721-07: DE defaultTaxRate差分の再確認

- 優先度: 低
- 状態: 保留
- 関連領域: country_presets
- 前提・ブロッカー: 実効39.4%とpreset39%の差が許容閾値内とされている
- 完了条件: 現行ソース、算定条件、丸め方を確認し、変更要否を記録

## BL-20260721-08: GB referenceRent — ONS PRMS調査

- 優先度: 低
- 状態: 未着手
- 関連領域: country_presets / GB
- 前提・ブロッカー: LCF由来の£247/月は全世帯平均（持ち家含む）で移住者実態と乖離。ONS Private Rental Market Summary Statistics（PRMS）が必要。
- 完了条件: ONS PRMSスクリプト作成→1LDK相当中央値取得→referenceRent更新
