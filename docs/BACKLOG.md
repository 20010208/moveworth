# MoveWorth Backlog

最終更新: 2026-07-22（BL-20260722-03完了）

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
- 状態: 完了
- 関連領域: country_sources
- 前提・ブロッカー: 解消。BGは政府行政登録IISDA、CYは新`gov.cy` Migration Departmentルートを確認
- 完了内容: HTTP 200と手続き本文を確認したBG 2件・CY 4件を`purpose=visa`、`status=alive`、`source=manual`で登録。DB再読込6/6件一致、既存BG/CY対象外12件不変
- 完了条件: 政府・官報・公式法令DB等の到達可能な本文ページを確保し登録済み

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
- 状態: 部分対応・継続中
- 関連領域: study_blog_posts / scripts
- 対応済み: study側のZH欠落・example.com・GPT拒否検出を終了コードへ反映。`visa-bg` JA/EN/ZHと`visa-cy` ZHの参考資料欠落を政府公式visaソースで補完
- 継続項目: study全件のtitle/description/content構造、URL重複、生URL、参照ラベル、参考資料セクション数の横断検証
- 前提・ブロッカー: blog_posts側との残存検証機能差
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
- 状態: 完了
- 関連領域: country_presets / GB
- 確認結果: ONS PRMS最終公表（2022年10月～2023年9月）、England全域・全物件タイプ月額中央値£850。標本はEnglandのみでUK全体ではない
- 完了内容: GB `referenceRent`を£1,500→£850へ更新、公式URLを`country_sources`へ登録、`simulator_personas`を全件再シードしてpreset不一致0件を確認

## BL-20260722-01: 検証スクリプトのDE税率ハードコード修正

- 優先度: 低
- 状態: 完了
- 関連領域: country_presets / 検証スクリプト
- 対象: `scripts/validate-simulator-blog.ts` / `scripts/_audit-persona-rates.ts`
- 前提・ブロッカー: 解消。両スクリプトの手動税率表を削除
- 完了内容: `countryPresets`の直接importへ統一し、DE 39%を含む全50カ国を動的参照。ペルソナ147件の税率乖離0件・重複0件、対象lint・型チェック通過
- 完了条件: `countryPresets`の直接参照へ変更し、DEを含むpreset税率の同期漏れがないことを確認済み

## BL-20260722-02: validate-simulator-blogのtoJPYハードコード同期廃止

- 優先度: 低
- 状態: 未着手
- 関連領域: 為替レート / 検証スクリプト
- 対象: `scripts/validate-simulator-blog.ts` / `src/app/study-site/simulate/page.tsx`
- 前提・ブロッカー: validator内の`TO_JPY`複製表がRON/BGN/HUFを含まず、実画面には登録済みなのに未登録と誤検出する
- 完了条件: 為替レート定義を共通化または実コードから安全に参照し、validatorの重複ハードコードと誤検出を解消

## BL-20260722-03: 同日複数visa公開時のstudy自動公開取りこぼし

- 優先度: 中
- 状態: 完了
- 関連領域: `scripts/publish-study-country-next.ts` / `scripts/publish-study-work-next.ts`
- 経緯:
  - 両スクリプトとも「対象日付に`is_published=true`かつ`published_at`が一致するvisa-*を`.limit(1)`で1件だけ取得」する設計だった
  - 2026-07-20（月）に`visa-tr`と`visa-rs`が同日`published_at`となり、翌火曜(07-21)のGHA実行で`visa-tr`のみがクエリに乗り、`study-country-rs`は一度も処理対象にならず`is_published:false`のまま放置されていた（実行ログで確認済み）
- 修正内容:
  - `.limit(1)`を廃止し、終端日は従来通り（study-country=昨日、study-work=5日前）維持したまま、開始側のみ7日lookbackした範囲で対象visaを全件取得・全件ループ処理する方式へ変更
  - `MAX_PER_RUN=10`の安全キャップを新設。ただし判定基準は「日付範囲内の生visa件数」ではなく「実際に公開が必要な未公開対象件数」とし、開局時の一括公開バッチ等が範囲に混ざっても既に公開済みなら誤って中断しないよう調整（dry-run検証で誤検知を発見し修正済み）
  - `DRY_RUN=true`環境変数で判定のみ確認できるモードを追加
- 検証: dry-run→本番実行の順で確認。本番実行で`study-country-rs`のみ公開（is_published:false→true）、`study-country-tr`はスキップ、対象外study_blog_posts 113件は変化なしを確認
- `study-work-rs`は対象日範囲外のため今回は未実行（該当visaがまだ5日経過していないため、対象日到達後に自動実行される想定）
- 完了条件: 同一日に複数visaが公開された場合でも、該当する全てのstudy-country-{code}/study-work-{code}が取りこぼされずに処理されるようクエリ・ループ設計を修正する。あわせて`study-country-rs`・`study-work-rs`の公開要否を別途判断する → 修正完了、`study-country-rs`は公開済み、`study-work-rs`は今後のスケジュール実行で自動処理される

## BL-20260722-04: study_blog_postsにis_promotionカラム追加

- 優先度: 低
- 状態: 未着手
- 関連領域: `study_blog_posts` / `src/components/study-blog/study-blog-post-content.tsx`
- 前提・ブロッカー: `study_blog_posts`テーブルには`is_promotion`カラムが存在しない（`blog_posts`のみに存在）。MiriCanvas記事（`miricanvas-ai-presentation-guide-2026`）をstudy.moveworthapp.com側にも投稿した際、PR開示は本文内【PR】表記のみで担保し、blog_posts側のような自動PRバッジ表示ができなかった
- 完了条件: `study_blog_posts`へ`is_promotion`カラムを追加するマイグレーションを実施し、`study-blog-post-content.tsx`に`blog-post-content.tsx`と同等のPRバッジ表示ロジックを実装する。既存記事への影響（デフォルト値等）を確認した上でユーザー承認を得て実施する
