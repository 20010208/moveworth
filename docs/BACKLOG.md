# MoveWorth Backlog

最終更新: 2026-07-21

> 本ファイルはプロジェクト全体の未完了タスクを管理する。
> `docs/redirect-backlog.md` はリダイレクト専用として別管理する。
> 以下は2026-07-21時点の引き継ぎサマリーから移行した項目であり、着手前に実コード・DB・最新状況を再確認すること。

## BL-20260721-01: C-5給与・生活費grounding（Group B実データ取得）

- 優先度: 中
- 状態: 完了
- 関連領域: country_presets / industry-salaries / living cost
- 現状:
  - グループA全19カ国（パイロット5カ国 + Batch 2〜4の14カ国）は完了
  - GB/JP完了（ASHE 2023/MHLW令和5年実測値反映済み）
  - CA/AU/CH完了。CA/AUは9業種を公式統計値へ更新。CHはFSO LSE 2024公式XLSXのNOGAセクション別中央値から9業種を反映
  - CA/CH生活費は公式分類不足、AU生活費はHES等価係数がBasic CURF限定のため取得不可として現行値を維持
  - NZ/KR/US完了。Stats NZ QES 2026年3月、雇用労働部2025年6月、BLS OEWS May 2025から各9業種を更新
  - NZ/KR生活費はCP042相当なしのため現行値を維持。US生活費はBLS CE PUMD 2024からCP041+CP042を除外し、OECD修正等価スケールで3,700 USD/月を採用
  - JP給与は所定内給与額×12に年間賞与その他特別給与額を加えた9業種年収へ更新（月額2023年6月・賞与2022年暦年）
  - KRは雇用労働部PDF直接取得、USはOEWS Query System公開APIにより既知ブロッカーを解消
  - 公式給与URLを`country_sources`へ登録し、`simulator_personas`を全件再seedして汚染0件を確認
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
- 状態: 完了
- 関連領域: country_presets
- 確認結果: `defaultTaxRate=0.39`は実効39.4%を丸めた値。差分0.4ptは5ptの許容閾値内
- ソース: Bundeszentralamt für Steuern
- 完了内容: DEのnotesへ算定条件、丸め方、差分、ソースを記録。数値変更なし

## BL-20260721-08: GB referenceRent — ONS PRMS調査

- 優先度: 低
- 状態: 未着手
- 関連領域: country_presets / GB
- 前提・ブロッカー: LCF由来の£247/月は全世帯平均（持ち家含む）で移住者実態と乖離。ONS Private Rental Market Summary Statistics（PRMS）が必要。
- 完了条件: ONS PRMSスクリプト作成→1LDK相当中央値取得→referenceRent更新

## BL-20260722-01: 検証スクリプトのDE税率ハードコード修正

- 優先度: 低
- 状態: 未着手
- 関連領域: country_presets / 検証スクリプト
- 対象: `scripts/validate-simulator-blog.ts` / `scripts/_audit-persona-rates.ts`
- 前提・ブロッカー: 両スクリプトにDE税率35%がハードコードされ、現行preset 39%と不一致
- 完了条件: DE税率を現行presetと一致させるか、`countryPresets`の直接参照へ変更し、誤検出しないことを確認
