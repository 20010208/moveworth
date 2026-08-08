# MoveWorth Backlog

最終更新: 2026-08-09（BACKLOG第1・第2パスread-only棚卸しを反映し、ACTIVE / EXECUTION VERIFICATION / DONE・ARCHIVE の3区分へ全面再構成）

> 本ファイルはプロジェクト全体の未完了タスクを管理する。
> `docs/redirect-backlog.md` はリダイレクト専用として別管理する。
> 完了済み項目の詳細な経緯・修正内容は本ファイルへ全文複製せず、`.ai/CURRENT_HANDOFF.md`（現在地）・git commit履歴を正とする（DEC-20260721-06）。
> 着手前に実コード・DB・最新状況を再確認すること（本ファイルの記載自体が古くなっている可能性がある）。

---

## 1. ACTIVE

### High

#### BL-20260809-01: country_sources content hash schema mismatch

- 優先度: 高
- 状態: 未着手（**現在進行形の既知バグ**）
- 関連領域: `scripts/check-source-content-hash.ts` / `country_sources` / `.github/workflows/health-check-country-sources.yml`
- 現状: `check-source-content-hash.ts`が`content_hash`・`content_hash_at`列を要求しているが、本番`country_sources`にはこれらの列が存在しない。2026-08-09の実`SELECT`で`column country_sources.content_hash does not exist`を確認済み。`scheduled_publish_at`と異なり、独立した`supabase/*.sql`migrationファイルが作られておらず、コード内コメントのSQLのみで適用状況の追跡もされていない
- 影響: 毎月1日02:00 UTCの`Health Check — Country Sources`ワークフロー「Monthly — content hash check」stepが、実行されるたびに確実に失敗する（`process.exit(1)`）
- 完了条件: `supabase/add_content_hash.sql`等として正式なmigrationファイルを作成しユーザー承認のうえ本番Supabaseへ手動適用、適用後に実`SELECT`で列存在とPostgRESTスキーマキャッシュ反映（`NOTIFY pgrst, 'reload schema';`）を確認する

#### BL-20260809-02: Published Study validator debt（現状値の確定記録）

- 優先度: 高
- 状態: 一部対応中（GR/ID 2件は前セッションで対応済み、残り52件は未着手）
- 関連領域: `study_blog_posts` / `scripts/utils/study-publication-quality.ts`
- 現状: 公開済み`study-country-*`/`study-work-*` 103件に実`validateStudyPublication()`を再実行した結果、**PASS 51件 / FAIL 52件**（2026-08-09測定、確定値）。前セッション終了時点の把握値（country 28 PASS/23 FAIL、work 23 PASS/29 FAIL、合計51/52）と完全一致しドリフトなしを確認
- 対応方針: **一括修正は禁止**。国ごとに「registry拡充 → validator再計測 → 残存記事のみtarget patch」の順で段階的に対応する
- 完了条件: 段階的にFAIL件数を削減する（一度に全件へ手を付けない）。次回作業時はまず52件の内訳（対象国・FAIL理由）を再取得してから着手国を選定する

---

### Medium

#### BL-20260809-03: Vietnam grounding（study-country-vn / study-work-vn）

- 優先度: 中
- 関連領域: `country_sources` / `study_blog_posts`
- 既知事項:
  - `xuatnhapcanh.gov.vn`はstability gate（独立GET 3/3）で失敗し、registry Batch 2から正式除外済み。そのままの状態で再登録しない
  - `vnembassy-jp.org`（ベトナム在日大使館公式）がregistry追加候補
  - `study-country-vn`はja/zhが既に`vnembassy-jp.org`相当を引用しているのに対し、enは日本側大使館`vn.emb-japan.go.jp`（第三国source）を引用しており、修正が必要
  - registry追加だけでは全言語PASSにならないことを検証済み（registry追加のみ→ja/zh PASSだがen FAIL。article target patch併用で初めて全言語PASS）
- 完了条件: `vnembassy-jp.org`をregistryへ追加した上で、`study-country-vn`のen参照セクションを`vnembassy-jp.org`へtarget patchする（両方が揃って初めて完了）。`study-work-vn`は別途FAIL理由を確認して対応

#### BL-20260809-04: Registry Batch 3候補

- 優先度: 中
- 関連領域: `country_sources`
- 残存FAIL国・理由別記録:
  - DE / MT: 既知候補URLがCloudflare 403でブロック
  - ME / IE: 既知候補URLが404または接続失敗
  - RS / CN: country側は解消済みだがwork側の候補source不足
  - VN: 上記BL-20260809-03参照（xuatnhapcanh.gov.vn stability gate失敗）
- 完了条件: 各国について代替の公式URLを調査し、HTTP到達性・本文一致を確認したうえでユーザー承認を得てbatch登録する

#### BL-20260809-05: Existing Country publisher blocked-only deploy

- 優先度: 中
- 関連領域: `.github/workflows/publish-study-country.yml`
- 現状: `publish-study-country-next.ts`実行後の「Trigger Vercel redeploy」stepが`if:`条件なし・`published_count`等の出力チェックなしで無条件実行される。`curl -X POST`もHTTPステータス未検証。Scheduled Publisher（`publish-scheduled-study.yml`）で導入した`published_count>0`条件・`--fail-with-body`は未反映
- 完了条件: Scheduled Publisher相当のdeploy条件（実publish件数>0の場合のみdeploy）とHTTP失敗検知をこちらにも反映する

#### BL-20260809-06: Existing Work publisher blocked-only deploy

- 優先度: 中
- 関連領域: `.github/workflows/publish-study-work.yml`
- 現状: BL-20260809-05と同一パターン（`publish-study-work-next.ts`側も無条件`curl -X POST`のみ）
- 完了条件: BL-20260809-05と同様の対応をWork publisher側にも適用する

#### BL-20260809-07: Guide ZH gaps

- 優先度: 中
- 関連領域: `study_blog_posts`（category=guide, work）
- 現状（2026-08-09実測、公開済み全件走査）: category=guideでZH完全欠落3件（`study-abroad-japanese-services-guide-2026` / `study-abroad-budget-saving-guide-2026` / `study-abroad-job-hunting-guide-2026`）、category=workの横断ガイド`study-abroad-work-rules-all-countries-2026`もZH欠落。**計4件**
- 注記: BL-20260722-06（自動公開時のzh検証追加、DONE/superseded）とは別問題。あちらは自動公開ゲートの話、こちらは既に公開済みの記事にZHが最初から存在しないデータ欠損
- 完了条件: 4記事へZH本文をtarget patchで追加する（ユーザー承認・品質基準確認後）

#### BL-20260809-08: RU student visa official source

- 優先度: 中
- 関連領域: `country_sources`
- 現状（2026-08-09実測）: RUのalive source合計1件のみ（`https://studyinrussia.ru/en/`、purpose=study）。purpose=visaの登録は0件。学生ビザに直接対応する公式sourceが不足
- 完了条件: ロシア外務省・移民局等、学生ビザ手続きの公式一次情報を調査・HTTP確認のうえregistry登録する

#### BL-20260809-09: Montenegro reference mismatch

- 優先度: 中
- 関連領域: `country_sources` / `study_blog_posts`
- 現状: MEはalive source 3件（study×2: `ucg.ac.me`大学サイト・`gov.me/en/mps`、visa×1: `gov.me/en/mup`）が既に存在し、source空白ではない。しかし`study-work-me`のvalidator再実行では依然FAIL（content.enの参照URLがこの3件のいずれとも一致しない）
- 対応方針: source不足ではなく**記事reference mismatch**として扱う（GR/ID修正と同型）
- 完了条件: `study-work-me`のen参照セクションを既存registry済みURLへtarget patchする

#### BL-20260809-10: alive source verification interval

- 優先度: 中
- 関連領域: `scripts/verify-country-sources.ts` / `.github/workflows/health-check-country-sources.yml`
- 現状: `status=alive`のsourceは月次`--re-verify`でのみ再検証される。週次は`dead`/`unverified`のみが対象。alive→deadへの遷移ロジック自体（`checkUrlEnhanced()`）は正しく実装されているが、alive状態のまま実際には死んでいるURLの検出に最大約1ヶ月の遅延が生じ得る
- 判断待ち事項: 現行の月次サイクルを許容仕様とするか、週次にaliveも含める等の頻度変更を行うか、ユーザー判断が必要
- 完了条件: 上記いずれかの方針を決定し、必要なら実装・`.ai/DECISIONS.md`への記録を行う

#### BL-20260721-06: study側の機械検証基盤強化

- 優先度: 中
- 状態: 部分対応・継続中
- 関連領域: study_blog_posts / scripts
- 対応済み: study側のZH欠落・example.com・GPT拒否検出を終了コードへ反映。visa-bg/cyの参考資料欠落を政府公式visaソースで補完
- 継続項目: study全件のtitle/description/content構造、URL重複、生URL、参照ラベル、参考資料セクション数の横断検証
- 補足（2026-08-09）: `getApprovedSources()`/`validateStudyPublication()`によるsource-groundingの検証はBL-20260809-02として別記録済み。本項目は構造検証（URL重複・生URL・ラベル等）を指し、対象が異なる

#### BL-20260722-05: ロシア・サウジアラビアのcountry-presets追加

- 優先度: 中
- 状態: 未着手
- 関連領域: `src/data/country-presets.ts` / `src/data/industry-salaries.ts` / `country_sources`
- 前提・ブロッカー: シミュレーター用presetは既存grounding済み50カ国と同じ品質基準（税率・生活費・給与を公的統計一次情報から取得）が必要。モデル知識のみでの補完は禁止（DEC-20260721-02）
- 完了条件: RU/SAについて政府統計等の一次情報から税率・生活費・給与の実測値を取得し、`country_sources`へ登録した上で`country-presets.ts`・`industry-salaries.ts`へ反映。反映後は`simulator_personas`の再seed・監査を実施する
- 補足（2026-08-09）: BL-20260809-08（RU student visa official source）とは別物。こちらはシミュレーター用の税率・生活費・給与presetの話であり、student visa向けregistryとは対象領域が異なる

---

### Low / Future improvement

#### BL-20260809-11: --recheck-ids

- 優先度: 低
- 関連領域: `scripts/verify-country-sources.ts`
- 現状: 特定の`country_sources.id`のみを対象に再検証するCLIフラグが存在しない（`--dry-run`/`--re-verify`/`--recheck-dead`/`--recheck-unverified`のみ）
- 完了条件: `--recheck-ids=<id1>,<id2>,...`相当のオプションを追加する

#### BL-20260809-12: Study blocked Issue auto-close

- 優先度: 低
- 関連領域: `scripts/utils/github-issue-dedup.ts` / `scripts/utils/study-publish-issue.ts`
- 現状: `[study-publish][slug:<slug>] publication blocked`というIssueが、該当記事が後日validator PASSして公開成功しても自動closeされない仕組みが存在しない（`github-issue-dedup.ts`にはsearch/create/comment関数のみでclose関数は皆無）
- 完了条件: 公開成功時に対応する`blocked` Issueを検索しcloseする処理を追加する

#### BL-20260809-13: Vercel deploy failure recovery runbook

- 優先度: 低
- 関連領域: `.github/workflows/publish-scheduled-study.yml` / 運用文書
- 現状: Scheduled PublisherでDB publish成功後にVercel deploy hookが失敗した場合、記事は`is_published=true`のままscheduled candidateから外れる（optimistic exact-one updateの設計上、再publishは不要かつ安全にスキップされる）。しかし「deploy失敗時に何をすべきか」の正式なrunbook・専用リトライ手順は文書化されていない（`workflow_dispatch`での手動再実行自体は可能）
- 完了条件: 手動deploy再試行手順をdocs化する（専用scriptの要否は判断次第）

#### BL-20260809-14: Thumbnail health

- 優先度: 低
- 関連領域: `scripts/inspect-all-blog-posts.ts`
- 現状: thumbnail欠落・dead URL等の定期健全性チェックが存在しない（`inspect-all-blog-posts.ts`にthumbnail関連チェック0件）。個別設定用scriptやscratch調査script（`_audit-blog-thumbnails.ts`等）はあるが、定期実行される健全性チェックの一部にはなっていない
- 完了条件: `inspect-all-blog-posts.ts`等へthumbnail欠落・URL到達性チェックを追加する

#### BL-20260721-04: 部分更新機能の汎用化

- 優先度: 低
- 状態: 未着手
- 関連領域: 生成・修正スクリプト
- 前提・ブロッカー: force-regenerateによる情報欠落事故を回避する設計
- 完了条件: 税率等の指定セクションだけを安全に更新でき、他フィールド不変を機械検証できる
- 補足（2026-08-09）: `scripts/utils/db-update.ts`の`updateExactlyOneById()`はDB行単位のexact-one更新保証であり、本項目が指す「記事本文内の指定セクションだけの安全な部分更新」とは異なる概念。関連はするが別物として区別する

#### BL-20260721-05: visa-guide第2弾の公式ソース確保

- 優先度: 低
- 状態: 保留
- 関連領域: visa-guide
- 対象候補: PT / ES / DE / IT
- 前提・ブロッカー: 政府公式の英語または現地語本文ソース
- 完了条件: 公式ソース確保後、draft生成・レビュー・publish-onlyの順で対応

#### BL-20260722-02: validate-simulator-blogのtoJPYハードコード同期廃止

- 優先度: 低
- 状態: 未着手
- 関連領域: 為替レート / 検証スクリプト
- 対象: `scripts/validate-simulator-blog.ts` / `src/app/study-site/simulate/page.tsx`
- 前提・ブロッカー: validator内の`TO_JPY`複製表がRON/BGN/HUFを含まず、実画面には登録済みなのに未登録と誤検出する
- 完了条件: 為替レート定義を共通化または実コードから安全に参照し、validatorの重複ハードコードと誤検出を解消

#### BL-20260722-04: study_blog_postsにis_promotionカラム追加

- 優先度: 低
- 状態: 未着手
- 関連領域: `study_blog_posts` / `src/components/study-blog/study-blog-post-content.tsx`
- 現状（2026-08-09再確認）: `is_promotion`列は`study_blog_posts`に依然として存在せず、`study-blog-post-content.tsx`にも参照なし
- 完了条件: `study_blog_posts`へ`is_promotion`カラムを追加するマイグレーションを実施し、`study-blog-post-content.tsx`に`blog-post-content.tsx`と同等のPRバッジ表示ロジックを実装する。既存記事への影響（デフォルト値等）を確認した上でユーザー承認を得て実施する

#### BL-20260728-01: study-abroad.tsのDBテーブル化

- 優先度: 低
- 状態: 未着手（中期対応）
- 関連領域: `src/data/study-abroad.ts` / `src/app/study-site/simulate/page.tsx`
- 完了条件: `study-abroad.ts`のデータを`simulator_personas`と同様にDBテーブル化し、`study-site/simulate/page.tsx`をDB参照へ移行する

#### BL-20260728-02: 留学費用（学費）データの一次情報調査

- 優先度: 低
- 状態: 調査中（`scripts/research-study-abroad-entry.ts`により部分対応）
- 関連領域: `src/data/study-abroad.ts` / `country_sources`
- 完了条件: 学費データ向けの新しい`country_sources.purpose`値（例: `education`）を定義し、教育省・大学連盟等の公式統計URLを対象国ごとに登録する

#### BL-20260801-08: Scripts TypeCheckの再発防止（将来改善・未着手）

- 優先度: 低
- 状態: 未着手
- 関連領域: `tsconfig.scripts.json` / `scripts/`ディレクトリ構成
- 完了条件（将来検討事項）: 新しい非module形式のscratchスクリプトが追加された際の同種のグローバルスコープ衝突を機械的に防ぐ仕組みを検討する

---

## 2. EXECUTION VERIFICATION

実装は完了しており、残るのは**本番での実行結果確認のみ**の項目。実装済みの内容をOPEN/未着手として扱わないこと。

### Scheduled Publish first production execution

- 実装・migration適用・push・CI成功・HU/RU/RO予約設定：すべてDONE（詳細は下記「4. Scheduled Publish恒久記録」参照）
- 確認待ちは以下1点のみ：
  - `study-country-hu`（`scheduled_publish_at=2026-08-14T00:00:00Z`）の初回本番scheduled publish
- 確認予定日時: 2026-08-14 09:00 JST（08:00 Malaysia、00:00 UTC）
- 確認項目:
  - scheduled Workflow（`Publish Scheduled Study Articles`）が意図通り起動すること
  - validator PASSでHUが公開候補として処理されること
  - `study-country-hu`の`is_published`がtrueへ切り替わること
  - `published_count`が正しく出力されること
  - Vercel deployが成功すること
  - 本番ページ（study.moveworthapp.com）に反映されること
  - 不要な`[study-publish]`blocked Issueが作成されていないこと
  - `study-work-ru`・`study-country-ro`の`scheduled_publish_at`が意図せず変化していないこと
  - `study-country-hu`自身の`scheduled_publish_at`が`2026-08-14T00:00:00Z`のまま保持されていること（publish後もクリアされず監査記録として残る設計。期待状態: `is_published=true` かつ `scheduled_publish_at=2026-08-14T00:00:00Z`）

### Health Check recurring E2E

- BL-20260801-06の実装（Search API厳格検証・Supabase正確1件更新・id条件更新）はDONE、Codex最終判定PASS WITH NOTES
- 残るのは週次（土10:00 JST）・月次（毎月1日02:00 UTC）スケジュール実行による本番end-to-end確認のみ
- **既知の注意事項**: monthly runの「content hash check」stepは、BL-20260809-01（content_hash列が本番に未適用）により**現時点では確実に失敗する**。次回end-to-end確認でこの失敗が観測されても、BL-20260801-06自体の新規回帰ではなく、BL-20260809-01の既知バグであると認識すること

---

## 3. DONE / ARCHIVE

以下は完了済みとしてACTIVEから除外する。詳細な経緯・修正内容は`.ai/CURRENT_HANDOFF.md`および対応commitを参照（本ファイルへの全文複製はしない）。

| BL番号 | 内容 | 備考 |
|---|---|---|
| BL-20260721-01 | C-5給与・生活費grounding（Group B実データ取得） | 完了 |
| BL-20260721-02 | BG/CY一次情報URLの再調査・登録 | 完了 |
| BL-20260721-03 | study-country-tr中国語取りこぼし確認 | 完了 |
| BL-20260721-07 | DE defaultTaxRate差分の再確認 | 完了 |
| BL-20260721-08 | GB referenceRent — ONS PRMS調査 | 完了 |
| BL-20260722-01 | 検証スクリプトのDE税率ハードコード修正 | 完了 |
| BL-20260722-03 | 同日複数visa公開時のstudy自動公開取りこぼし | 完了 |
| BL-20260722-06 | study自動公開の品質チェックにZH検証を追加 | **DONE/superseded**（2026-08-09再確認）: 現コードでは`publish-study-country-next.ts`/`publish-study-work-next.ts`とも`validateStudyPublication()`（ja/en/zh全言語・200字以上必須）へ統一済みで、記載の前提（zh未チェックのqualityOk()）は現状と一致しない |
| BL-20260801-01 | research-study-abroad.ymlの0秒即失敗を修正 | 完了 |
| BL-20260801-02 | health-check-country-sources.ymlのIssue作成権限エラーを修正 | 完了 |
| BL-20260801-03〜05 | GHA Issue通知経路の是正（3段階の中間saga） | BL-20260801-06へsupersededされた中間状態のため要約のみ保持。技術的な誤りはないが最新状態を代表しない。詳細経緯は`.ai/CURRENT_HANDOFF.md`参照 |
| BL-20260801-06 | 残存fail-open経路の是正 | **実装DONE**（コード修正・push・GitHub側Workflow認識・Codex PASS WITH NOTES）。定期実行によるend-to-end確認のみ「2. EXECUTION VERIFICATION」へ分離 |
| BL-20260801-07 | Scripts TypeCheckの既存失敗解消 | 完了（CI run `30697986179` success） |

---

## 4. Scheduled Publish 恒久記録

- 実装commit: `76ea4d2 feat: add scheduled study publishing`（origin/mainへpush済み、CI成功確認済み）
- 実装済み機能:
  - `study_blog_posts.scheduled_publish_at`（nullable timestamptz）schema
  - partial index（`scheduled_publish_at`, `is_published=false AND scheduled_publish_at IS NOT NULL`条件）
  - 専用dedicated scheduled publisher（`scripts/publish-scheduled-study.ts`、毎日00:00 UTC実行）
  - 既存Country/Work publisherからの除外ロジック（`scheduled_publish_at`非NULLは通常publisherが自動スキップ）
  - validator（`getApprovedSources()`/`validateStudyPublication()`）による品質ゲート
  - Option C運用方針（品質NG候補はdraft維持＋GitHub Issue通知、公開自体は失敗させない。system errorのみ非0終了に反映）
  - GitHub Actions concurrency（`group: publish-scheduled-study, cancel-in-progress: false`）
  - optimistic exact-one update（`UPDATE ... WHERE id=? AND is_published=false AND scheduled_publish_at=? RETURNING id`。0件=競合skip、1件=成功、2件以上=system error）
  - `published_count`の即時・都度出力（部分失敗時も成功分の件数を保持）
  - partial-failure時もdeployが実行される設計（`if: always() && steps.publish.outputs.published_count > 0`）
  - curl HTTP失敗検知（`curl --fail-with-body --silent --show-error`）
  - DRY_RUN時の件数分離（`wouldPublishCount`は情報表示用、実際の`published_count`は常に0のまま）
- 予約設定済み（2026-08-09時点、DBで再確認済み・変化なし）:
  - `study-country-hu` → `scheduled_publish_at=2026-08-14T00:00:00Z`
  - `study-work-ru` → `scheduled_publish_at=2026-08-15T00:00:00Z`
  - `study-country-ro` → `scheduled_publish_at=2026-08-21T00:00:00Z`
- 本番実行確認: 「2. EXECUTION VERIFICATION」参照（HU初回実行のみ未確認）

---

## 5. Study grounding 恒久記録

- 関連commit:
  - `5b3882e fix: require grounded study article references`
  - `5dc7e62 fix: separate study source validation from display refs`
- 重要契約（`scripts/utils/study-publication-quality.ts`）:
  - `getApprovedSources(supabase, countryCode)`: approved registry（`country_sources`、purpose IN (study, visa)、status=alive）を**全件・上限なし**で返す。fail-closed（DBエラー時は`[]`へフォールバックせず必ずthrow）。publication validatorへ渡すのは常にこの関数の戻り値そのものであること
  - `selectStudyReferenceSources(allSources, max=5)`: 記事へ機械挿入する参考資料表示専用の単純slice。**validatorへは絶対に渡してはならない**（渡すと、registryにalive登録済みのURLが辞書順でmax件目以降になっただけで「未承認」と誤判定される構造的バグが再発する）
  - 上記2関数の分離は、Indiaの5件キャップバグ（registryにalive登録済みの`indembassy-tokyo.gov.in`が辞書順で5件キャップの外側に落ち誤ってFAIL扱いされていた事象）の恒久修正として導入された
- registry整備実績:
  - Batch 1: 13件登録（hk/tw/ch/jp/sg/mx/in/id、8ヶ国）— DBのみの変更、対応commitなし
  - Batch 2: 14件登録（us/fr/rs/au/tr/my/ro/gr/cn/ar/pl、11ヶ国）— DBのみの変更、対応commitなし。vn（`xuatnhapcanh.gov.vn`）はstability gate失敗により正式除外（BL-20260809-03/04参照）
- 現状のvalidator PASS/FAIL: BL-20260809-02参照（103件中PASS 51 / FAIL 52、2026-08-09測定）
