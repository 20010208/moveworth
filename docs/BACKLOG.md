# MoveWorth Backlog

最終更新: 2026-08-01（BL-20260801-07完了・BL-20260801-08追加）

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

## BL-20260722-05: ロシア・サウジアラビアのcountry-presets追加

- 優先度: 中
- 状態: 未着手
- 関連領域: `src/data/country-presets.ts` / `src/data/industry-salaries.ts` / `country_sources`
- 経緯: 自動投稿パイプラインの恒久対策（BL-20260722-03関連の派生対応）として、`generate-country-article.ts`の国選定ロジックを国連加盟193カ国ベースへ変更。優先度1（G20未登録国）としてRU（ロシア）・SA（サウジアラビア）を最優先候補に設定した
- 前提・ブロッカー: シミュレーター（`simulator_personas`等）で使う`country-presets.ts`の数値は、既存のgrounding済み50カ国と同じ品質基準（税率・生活費・給与等を公的統計の一次情報から取得）を満たす必要があり、モデル知識のみでの補完は禁止（DEC-20260721-02）。RU/SAはまだ`country-presets.ts`・`industry-salaries.ts`・`country_sources`のいずれにも未登録
- 完了条件: RU/SAについて、政府統計・公的統計等の一次情報から税率・生活費・給与等の実測値を取得し、`country_sources`へ登録した上で`country-presets.ts`・`industry-salaries.ts`へ反映する。反映後は`simulator_personas`の再seed・監査を実施する

## BL-20260722-06: study自動公開の品質チェックにZH検証を追加

- 優先度: 中
- 状態: 未着手
- 関連領域: `scripts/publish-study-country-next.ts` / `scripts/publish-study-work-next.ts`
- 経緯: `visa-me`公開後、`publish-study-country-next.ts`が`study-country-me`を自動公開した際、content.zhが空（0文字）のまま公開されてしまう事象が発生した。原因は両スクリプトの`qualityOk()`がcontent.ja/enの長さ・拒否パターン・example.comのみを検証し、**zhの存在・長さを一切チェックしていない**ため（コード確認済み）。手動でis_published:falseへ戻し、`backfill-study-zh.ts`と同一ロジック・品質基準でzhを対象限定生成した上で再公開して解消した
- 完了条件: `publish-study-country-next.ts`・`publish-study-work-next.ts`の`qualityOk()`に、`content.zh`の存在・長さ（200字以上等）・拒否パターン・example.com混入チェックを追加し、zh未生成または品質不良の記事が自動公開されないようにする

## BL-20260728-01: study-abroad.tsのDBテーブル化

- 優先度: 中
- 状態: 未着手（中期対応）
- 関連領域: `src/data/study-abroad.ts` / `src/app/study-site/simulate/page.tsx`
- 経緯: 留学サイトのシミュレーターが参照する国データ（`studyAbroadData`）が静的TypeScriptソースファイルであるため、`simulator_personas`（移住サイト側、Supabaseテーブル）のような自動追加ができない。`scripts/research-study-abroad-entry.ts`（`BL-20260728-02`関連）で調査支援パイプラインを実装したが、最終的な追記は人手でソースファイルを編集・commitする必要がある
- 完了条件: `study-abroad.ts`のデータを`simulator_personas`と同様にDBテーブル化し、`study-site/simulate/page.tsx`をDB参照へ移行する。移行後は研究パイプラインの出力をDB INSERTで完結できるようにし、ソースコード自動編集という高リスク操作を回避する

## BL-20260801-01: research-study-abroad.ymlの0秒即失敗を修正

- 優先度: 高
- 状態: 完了
- 関連領域: `.github/workflows/research-study-abroad.yml`
- 経緯: 2026-07-29の作成以降、push起因の全実行が0秒で即失敗（"This run likely failed because of a workflow file issue"）していた。IDE診断（GitHub Actions YAMLスキーマ検証）で`if:`条件式内の`secrets.SENDGRID_API_KEY`参照が`Unrecognized named-value: 'secrets'`エラーであることを確定。GitHub Actionsの`if:`条件式は`secrets`コンテキストを直接参照できない仕様（`env`/`with`/`run`は可）が原因
- 完了内容: job-level `env:`（`SENDGRID_API_KEY`/`NOTIFY_EMAIL`）を新設し、該当ステップの`if:`を`env.SENDGRID_API_KEY != ''`参照へ変更。あわせて`permissions: {contents: read, issues: write}`を明示的に追加（issue作成に必要な権限を既定値に依存させない）。Workflowの目的（土曜09:00 JST・留学国調査・GitHub Issue化・DB書き込みなし・記事公開なし）は変更していない
- 検証: js-yaml構文チェック、IDE診断エラー0件、cron=土09:00 JST一致確認、run:ブロックのbash -n構文チェック、git diffで意図外の変更がないことを確認
- 残存リスク: オフライン環境のためactionlint等の完全な機械検証はできず、IDE診断＋既知のGitHub Actions仕様に基づく判断。確実な確認は2026-08-01 09:00 JSTの実スケジュール実行を待つ必要がある

## BL-20260801-02: health-check-country-sources.ymlのIssue作成権限エラーを修正

- 優先度: 高
- 状態: 完了
- 関連領域: `.github/workflows/health-check-country-sources.yml`
- 経緯: 直近2回（2026-07-18, 07-25）のスケジュール実行で"Create GitHub Issue on dead URL detection"ステップが`HttpError: Resource not accessible by integration`で失敗していた。`permissions:`ブロックが未設定でGITHUB_TOKENのデフォルト権限がissue作成に不足していたと推定
- 完了内容: `permissions: {contents: read, issues: write}`を追加。実処理を確認した結果、`actions/checkout`（read）と`github.rest.issues.create()`（issues: write）以外のGitHub API操作はなく、`write-all`等の過剰権限は不要と判断
- 検証: js-yaml構文チェック、IDE診断エラー0件、git diffで意図外の変更がないことを確認
- 残存リスク: 確実な確認は次回スケジュール実行（2026-08-01 10:00 JST週次 / 次回月次実行）を待つ必要がある

## BL-20260801-03: GHA Issue通知経路の実行時問題を是正

- 優先度: 高
- 状態: 静的修正完了・実行確認待ち
- 関連領域: `.github/workflows/research-study-abroad.yml` / `.github/workflows/health-check-country-sources.yml` / `scripts/check-source-content-hash.ts` / GitHubラベル
- 経緯: BL-20260801-01・02の修正（commit `7ae0466`、push・active認識済み）に対するCodex独立監査でFAILとなり、以下6件の実行時問題が指摘された
  1. `content`/`source-updated`ラベルがリポジトリに存在しない
  2. health-checkのIssue作成条件が`if: failure()`のみで、npm ci失敗等でも「dead URL検出」として誤ってIssueを作ろうとする
  3. 週次・月次health-checkが同日実行された場合（2026-08-01が該当）に同一問題のIssueが重複作成されうる
  4. SendGrid用secretがjob全体（checkout/npm ci/調査スクリプト等）へ展開されていた
  5. `NOTIFY_EMAIL`未設定やSendGridのHTTP 4xx/5xxを検知できていなかった
  6. push後の実態（active化・ラベル状況）が運用文書に未反映だった
- 完了内容:
  - ラベル`content`（#1D76DB）・`source-updated`（#0E8A16）を新規作成（既存ラベルは無変更）
  - health-checkの3スクリプト実行ステップにidと`dead_found`出力を追加し、verify-country-sources.tsの確定マーカー文字列で判定。Issue作成条件を`dead_found=='true'`限定へ変更（Workflow失敗判定自体は変更していない）
  - 3つのIssue作成経路（research-study-abroad.yml / health-check-country-sources.yml / check-source-content-hash.ts）全てに、同一タイトルのopen issue存在チェックによる重複防止を追加。タイトルから日付・件数を除去し安定化
  - research-study-abroad.ymlのjob-level envからSendGrid系secretを削除し、専用のCheck email configurationステップ経由に変更。curlを`--fail-with-body`へ変更しHTTPエラーを検知可能化
- 検証: js-yaml構文チェック、IDE診断エラー0件、check-source-content-hash.tsのtsc型検査エラー0件、全12 run:ブロックのbash -n構文チェック、gh issue list/GitHub Search APIの読み取り専用実行確認、ラベル参照の文字列完全一致確認
- 残存リスク: 実際のWorkflow実行を経ていないため、動的な動作（Issue検索・作成ロジックの実挙動）は未確認。2026-08-01 09:00/10:00 JST等の次回実行結果の確認が必要
- 完了条件（実行確認待ち）: 次回スケジュール実行で意図通りに動作すること（dead URL非検出時は誤Issueが作られない、重複Issueが作られない、SendGrid未設定時はメール送信がスキップされる）を確認する
- **追記（2026-08-01）**: 本項目の修正（commit `e4de711`）に対するCodex独立再監査が再度FAILとなり、grep依存の判定・固定タイトル1件への集約・DB更新順序等、13件の追加問題が指摘された。詳細はBL-20260801-04を参照

## BL-20260801-04: GHA Issue通知経路の構造的是正（source単位化・終了コード契約・DB更新順序）

- 優先度: 高
- 状態: 静的修正完了・実行確認待ち（**「完全復旧」ではない**）
- 関連領域: `.github/workflows/research-study-abroad.yml` / `.github/workflows/health-check-country-sources.yml` / `scripts/verify-country-sources.ts` / `scripts/check-source-content-hash.ts` / `scripts/notify-dead-sources.ts`（新規） / `scripts/utils/github-issue-dedup.ts`（新規） / `.gitignore`
- 経緯: BL-20260801-03の修正（commit `e4de711`）に対するCodex独立再監査が再度FAILとなり、以下13件の実行時問題が指摘された（`e4de711`は2026-08-01にpush済み）
  1. research Issue検索が`--json title`のみ取得しつつ`.number`参照（常にnull）
  2. health-checkのschedule判定が`contains()`部分一致
  3. dead URL判定が自然言語ログのgrep依存でDB接続失敗等と区別不能
  4. dead URL詳細の機械可読出力がない
  5. health-check Issueが固定タイトル1件に集約され、異なる国・URLの通知を抑止してしまう
  6. weekly/monthly/manualの同時実行に対する排他制御がない
  7. source content hash通知も固定タイトル1件に集約
  8. source content hashをGitHub通知の成否に関わらず即座にDB確定保存
  9. monthly `--re-verify`がverify-country-sources.ts側の分岐順序により無視され、aliveが再検証されていなかった
  10. research Issueがskipされた場合もSendGridメールが毎回再送される
  11. SendGridの期待動作が仕様として明文化されていない
  12. 静的検証・機械テストの不足
  13. 運用文書がpush実態・監査結果を反映していない
- 完了内容:
  - `verify-country-sources.ts`: 終了コード契約（0=正常/2=dead URL検出/1他=処理失敗）新設、`.tmp/country-source-health/dead-sources.json`への機械可読出力、`--re-verify`分岐順序の修正（aliveを含む全件再検証）
  - `scripts/utils/github-issue-dedup.ts`（新規）・`scripts/notify-dead-sources.ts`（新規）: source単位（`country_sources.id`優先、なければ正規化URLのSHA-256ハッシュ）でのIssue検索・作成・コメントをfail-closedで実装
  - `check-source-content-hash.ts`: source単位通知へ変更、DB hash更新をGitHub通知成功後にのみ実施するよう順序を是正
  - `health-check-country-sources.yml`: concurrency追加（weekly/monthly/manual直列化）、schedule完全一致化、旧固定Issue作成ステップを`notify-dead-sources.ts`呼び出しへ置換
  - `research-study-abroad.yml`: research Issue検索を`--json number,title`へ修正、`created`出力によるSendGridメール重複再送の防止、SendGrid期待動作のコメント明文化
  - `.gitignore`: `/.tmp/`を追加
- 検証: js-yaml構文、IDE診断エラー0件、cron無変更、schedule完全一致確認、concurrency確認、全13 run:ブロックのbash -n、対象4 TSファイルのtsc型検査エラー0件、ローカルモックテスト（分岐ロジック6パターン・終了コード契約4パターン・dead-sources.jsonスキーマ・notifyAll()11パターン・DB hash更新順序4パターン）全件成功
- 残存リスク: 実際のWorkflow実行を経ていないため動的動作は未確認。jqコマンドはローカル未インストールのためフィルタロジックの等価性のみNode.jsで確認（GHA runnerにはプリインストール前提）。GitHub Actions自体はSearch→Create/Commentを完全な原子操作にはできないため、同時実行の完全排除ではなくconcurrencyによる直列化にとどまる
- 完了条件（実行確認待ち）: push後の次回スケジュール実行で、source単位の重複防止・終了コード判定・DB更新順序・SendGrid重複防止が意図通りに動作することを確認する
- **追記（2026-08-01）**: 本項目の修正（commit `db75e51`）に対するCodex独立監査が再度FAILとなり、月次content-hash skip・Supabaseエラー未確認・concurrency pending消失等7件の追加問題が指摘された。詳細はBL-20260801-05を参照

## BL-20260801-05: Workflow失敗判定の完全化（exit 2の扱い・DBエラー確認・concurrency queue・schema検証）

- 優先度: 高
- 状態: 静的修正完了・実行確認待ち（**「完全復旧」ではない**）
- 関連領域: `.github/workflows/research-study-abroad.yml` / `.github/workflows/health-check-country-sources.yml` / `scripts/verify-country-sources.ts` / `scripts/check-source-content-hash.ts` / `scripts/utils/github-issue-dedup.ts`
- 経緯: BL-20260801-04の修正（commit `db75e51`）に対するCodex独立監査が再度FAILとなり、以下7件の問題が指摘された（`db75e51`は2026-08-01にpush済み）
  1. 月次runでdead URLがあるとcontent-hash検査がskipされる（verify-country-sources.tsのexit 2で検証step自体がfailureになり、後続が暗黙のsuccess()でskipされていた）
  2. Supabaseの更新失敗を成功扱いしている（`upErr`警告のみで継続、または戻り値未確認のまま成功件数へ加算）
  3. concurrencyのpending runが3件以上で失われる（`cancel-in-progress: false`のみでは実質pending 1件までしか保持できない）
  4. GitHub APIレスポンスのschema検証が不十分
  5. researchのjq失敗時にfail-openとなる
  6. manual modeの不正値が成功no-opになる
  7. 文書が実際のcommit状態と一致していない
- 完了内容:
  - `verify-country-sources.ts`: DB status更新の`error`確認を追加。DB更新失敗が1件でもあれば、dead URL件数に関わらず処理障害としてexit 1を優先
  - `check-source-content-hash.ts`: 初回hash保存・通知後hash更新の両方で`error`確認を追加。DB更新失敗は成功件数へ加算せず、次回再検出される状態を維持
  - `scripts/utils/github-issue-dedup.ts`: Search/Issue作成/コメントAPIのレスポンスに厳格なschema検証（object形状・型・pull request混入なし等）を追加し`{}`や欠落フィールドを「既存なし」と誤認しないようにした。`per_page=100`＋total_countベースのpaginationを実装
  - `health-check-country-sources.yml`: 検証stepの終了コード2（dead URL検出）をstep成功として扱うよう変換し、月次content-hashが暗黙skipに巻き込まれないよう修正。Workflow全体のfailure化を末尾の専用stepへ分離。`concurrency`を`queue: max`へ変更。`workflow_dispatch.inputs.mode`を`type: choice`化し、shell側でも不正値を明示的に失敗させる
  - `research-study-abroad.yml`: `command -v jq`チェックと`if ! VAR=$(...)`パターンの徹底により、gh検索失敗・jq不在・jq解析失敗のすべてをfail-closedにした
- 検証: js-yaml構文、IDE診断エラー0件、cron無変更、全14 run:ブロックのbash -n、対象4TSファイルのtsc型検査エラー0件、ローカルモックテスト（github-issue-dedup.tsのschema/pagination 21パターン、notify-dead-sources.ts 11パターン、DB更新エラー×終了コード優先順位、exit code変換ロジック4パターン、manual modeのcase文6パターン、research-study-abroad.ymlの実run:ブロックをfake gh/jqで実行した6パターン）すべて成功
- 残存リスク: 実際のWorkflow実行を経ていないため動的動作は未確認。`queue: max`はIDE診断ではエラー0件だが公式ドキュメントでの一次情報確認は未実施。Issue #1／#2（head SHA `7ae0466`の旧集約通知実装による作成、詳細はBL-20260801-06参照）の整理は範囲外として保留
- 完了条件（実行確認待ち）: push後の次回スケジュール実行で、dead URL検出時のcontent-hash継続実行・Workflow最終failure化・DB更新エラー時の非0終了・concurrencyのpending保持・不正manual mode時の失敗が意図通りに動作することを確認する
- **追記（2026-08-01）**: 本項目の修正（commit `d614ede`）に対するCodex独立監査が再度FAILとなり、Search APIのtotal_count/pagination不整合・Supabase更新件数未確認・verifyのURL条件更新・runExtract()取得エラー未確認等5件の追加問題が指摘された。詳細はBL-20260801-06を参照

## BL-20260801-06: 残存fail-open経路の是正（Search API total_count厳格検証・Supabase正確1件更新・id条件更新）

- 優先度: 高
- 状態: **コード修正・push・GitHub側Workflow認識は完了**。Codex最終判定は**PASS WITH NOTES**。定期実行によるend-to-end確認は未完了（**「厳格検証済み」「完全復旧」ではない**）
- 関連領域: `scripts/utils/github-issue-dedup.ts` / `scripts/utils/db-update.ts`（新規） / `scripts/verify-country-sources.ts` / `scripts/check-source-content-hash.ts`
- 経緯: BL-20260801-05の修正（commit `d614ede`）に対するCodex独立監査が再度FAILとなり、以下5件の問題が指摘された（`d614ede`は2026-08-01にpush済み）
  1. GitHub Search APIの不完全・矛盾した応答（`total_count`不正、ページ間不整合、Issue番号重複等）を「既存Issueなし」と扱うfail-open
  2. Supabase更新が0件または複数件でも成功扱いされる可能性
  3. `verify-country-sources.ts`がURL条件（`.eq("url",...)`）で複数行を更新する可能性（同一URLを共有する別source・別国の行を誤って更新しうる）
  4. `runExtract()`の既存alive取得でSupabaseの`error`を確認していなかった
  5. Issue作成レスポンスのtitleが要求と食い違っていても成功扱いにしていた
- 完了内容:
  - `github-issue-dedup.ts`: `total_count`を整数・0〜1000の範囲・ページ間一致で厳格検証。矛盾（0件なのにitemsあり、空ページの早期到達、件数超過、Issue番号のページ内/ページ間重複）をすべてthrow。全ページ完全取得後のみタイトル完全一致判定。Issue作成レスポンスのtitleが要求と完全一致することも追加検証
  - `scripts/utils/db-update.ts`（新規）: `updateExactlyOneById()`で`.select("id").single()`により0件/複数件更新をエラー検知し、返却idの一致も確認する共通ヘルパーを新設
  - `verify-country-sources.ts`: status更新を`updateExactlyOneById()`（id条件）へ変更し`.eq("url",...)`を廃止。`runExtract()`の既存alive取得に`error`確認を追加（取得失敗時はthrowし0件の正常ケースと区別）
  - `check-source-content-hash.ts`: 全DB更新（初回保存・変更なし更新・通知後hash更新）を`updateExactlyOneById()`経由へ変更
- 検証: git diff --check、対象5TSファイルのtsc型検査エラー0件、ローカルモックテスト（github-issue-dedup.tsのtotal_count/pagination/schema/title検証31パターン、notify-dead-sources.ts 11パターン、db-update.tsの実装＋fake Supabaseクライアントで12パターン、runExtractのalive取得エラー処理5パターン）すべて成功。今回yamlファイルは変更なし
- 残存リスク: `updateExactlyOneById()`はSupabaseの`.single()`挙動に依存。Issue #1／#2（head SHA `7ae0466`の旧集約通知実装による作成。週次run`30683910156`・月次run`30685732548`）の整理は範囲外として保留
- **追記（2026-08-01）**: 本項目の修正commit `d614ede`に対するCodex独立監査で指摘された5件へ対応した追加commit`66b6e38`を作成し、`e4de711`〜`66b6e38`の**4commit**（`e4de711`／`db75e51`／`d614ede`／`66b6e38`。`7ae0466`はこの範囲に含まない、既に別途push済みのため）を`git push origin main`でorigin/mainへpush済み（fast-forward、force不使用）。push後、GitHub上で`research-study-abroad.yml`・`health-check-country-sources.yml`とも`state: active`・正しい表示名・`queue: max`定義の正常認識を確認。push自体による対象2Workflowの自動起動なし。この状態に対するCodex最終監査は**PASS WITH NOTES**
- **状態の内訳**:
  - コード修正・push: **完了**
  - GitHub側Workflow認識（active・表示名・queue: max）: **完了**
  - 定期実行によるend-to-end確認（dead URL検出→source単位Issue通知→DB更新、SendGrid実送信等）: **未完了**（次回スケジュール実行で確認予定）
  - 旧Issue #1／#2整理: **未完了**（新Issue形式の実動作確認後に別タスクで着手）
- 完了条件（実行確認待ち）: 次回スケジュール実行で、Search APIの実応答に対する厳格検証・Supabase更新の正確性・id条件更新が意図通りに動作することを確認する

## BL-20260801-07: Scripts TypeCheckの既存失敗解消

- 優先度: 中
- 状態: **完了**
- completed date: 2026-08-01
- 実装commit: `5615464`（"fix: resolve scripts typecheck errors"、origin/mainへpush済み）
- CI run: `30697986179`（event=push、head SHA=`5615464`、conclusion=`success`）
- 関連領域: `scripts/_calc-b1b2b3-correction.ts` / `scripts/_check-b4-sources.ts` / `scripts/_check-hu-cp04.ts` / `scripts/_check-pt-cz-cp041.ts` / `scripts/_check-study-work-urls.ts` / `scripts/_check-tr-mukerrer.ts` / `scripts/_fetch-b4-data.ts` / `scripts/_fetch-eurostat-hbs4.ts` / `scripts/_fetch-eurostat-ses22-v3.ts` / `scripts/_patch-ar-tax-brackets.ts`
- 背景: pushのたびに`Scripts TypeCheck`ワークフローが赤くなり、今回のGHA緊急修正一連のcommitとは無関係な既存エラーがCIのノイズになっていた。2026-07-28以降のscripts変更を伴うほぼ全pushで同様に失敗しており、長期化した既存問題だった
- 原因: `tsconfig.scripts.json`の`include: ["scripts/**/*.ts"]`がコミット済みのscratchスクリプトまで型検査対象に含めており、追跡済み失敗ファイル計10件は原因の異なる2種類に分かれていた
  - **9件**: いずれもimport/export文を持たず、TypeScriptがモジュールではなく単一グローバルスコープの「スクリプト」として扱うため、複数ファイルが同名変数・同名関数（`COUNTRIES`・`PPP`等）を独立に定義しており衝突エラーが発生していた（`TS2393`・`TS2451`。`_fetch-eurostat-hbs4.ts`の`TS2339`もこの衝突の派生）
  - **1件**（`scripts/_patch-ar-tax-brackets.ts`）: import文を2行持つ独立したモジュールでグローバルスコープ衝突には該当せず、原因は無関係の`TS1501`（dotAll `s`フラグがES2017未満のtargetで使用不可）
- 検討した案と採否:
  - 案A「広域exclude」（`"scripts/_*.ts"`をtsconfigへ追加）: **不採用**。追跡済み133件を一括除外してしまい、DB更新・公開・削除・seed・migration等を実行可能な追跡済みスクリプトまで型検査対象外になるため、Codex監査で`FAIL`
  - 案B「既知10件の個別exclude」: **不採用**。残り123件は型検査可能だったが、DB更新可能な`_patch-ar-tax-brackets.ts`を含む10件を検査対象外にする方針自体が採用されず、Codex監査で`FAIL`
  - 案C「各scratchスクリプトの型エラーを個別修正」（**最終採用**）: 9ファイルへ`export {};`を1行追加してグローバルスコープ衝突を解消し、`_patch-ar-tax-brackets.ts`の3正規表現をES2017互換の`[\s\S]*?`へ変更（dotAll`s`フラグ削除）。`tsconfig.scripts.json`への新規exclude追加なし。追跡済み223件のうち既存exclude2件を除く**221件全てが引き続き型検査対象**のまま
  - 案D「TypeCheckを正式script専用構成へ分離」: 見送り（現時点では過剰設計と判断、検討記録としてのみ残す）
- 完了根拠:
  - 追跡済み10ファイルを直接修正し、TypeCheck除外を追加しなかった
  - GitHub Actions実run `30697986179`が`success`
  - 旧エラー`TS2393`／`TS2451`／`TS2339`／`TS1501`のいずれも再発なし
  - Codex最終監査は`PASS WITH NOTES`（push前必須修正なし）
- **残存リスク（follow-upはBL-20260801-08）**: 将来新しい非module形式のscratchスクリプトが追加されるとグローバル衝突が再発しうる。未追跡scratchが存在するローカル環境では通常の`npx tsc`は引き続き失敗する。scratch専用ディレクトリや別tsconfigへの整理は将来改善として保留
- 詳細な調査内容・修正内容は`.ai/CURRENT_HANDOFF.md`の「Scripts TypeCheck復旧の確定記録」節を参照

## BL-20260801-08: Scripts TypeCheckの再発防止（将来改善・未着手）

- 優先度: 低
- 状態: 未着手
- 関連領域: `tsconfig.scripts.json` / `scripts/`ディレクトリ構成 / 開発運用ルール
- 背景: BL-20260801-07でCIレベルの`Scripts TypeCheck`失敗（追跡済み10ファイル）は解消したが、根本的な「非module形式のscratchスクリプトが同一グローバルスコープを共有する」という構造自体は変更していない
- 完了条件（将来検討事項）:
  - 新しい`scripts/_*.ts`形式のscratchスクリプトが追加された際、同種のグローバルスコープ衝突（`TS2393`/`TS2451`等）を機械的に防ぐ仕組みを検討する（例: scratchスクリプト作成時に`export {};`を含める運用ルール化、lintルール、テンプレート化等）
  - 未追跡scratchファイルが存在するローカル環境で通常の`npx tsc --project tsconfig.scripts.json --noEmit`が失敗する運用課題への対応要否を検討する
  - scratch専用ディレクトリまたは別tsconfigへの整理（BL-20260801-07で検討した案Dに相当）の要否を判断する
- 前提・ブロッカー: なし。優先度は低く、次に同種のCI失敗が発生した際、または開発フロー整理のタイミングで着手を検討する

## BL-20260728-02: 留学費用（学費）データの一次情報調査

- 優先度: 中
- 状態: 調査中（`scripts/research-study-abroad-entry.ts`により部分対応）
- 関連領域: `src/data/study-abroad.ts` / `country_sources`
- 経緯: `study-abroad.ts`の`costs.tuitionMin/Max`（学費）に相当する一次情報は、`country_sources`に対応するpurposeカテゴリ（教育省統計・大学連盟等）が存在せず、どの登録国についても取得できない。生活費（`livingMin/Max`）は`country-presets.ts`の`referenceLivingCost`から算出可能なため対応済み
- 完了条件: 学費データ向けの新しい`country_sources.purpose`値（例: `education`）を定義し、教育省・大学連盟等の公式統計URLを対象国ごとに登録する。登録後は`research-study-abroad-entry.ts`が学費項目も自動抽出できるよう拡張する
