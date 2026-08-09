# MoveWorth Backlog

最終更新: 2026-08-10（BL-20260809-02のBatch1結果反映、BL-20260809-09 DONE化）

> 本ファイルはプロジェクト全体の未完了タスクを管理する。
> `docs/redirect-backlog.md` はリダイレクト専用として別管理する。
> 完了済み項目の詳細な経緯・修正内容は本ファイルへ全文複製せず、`.ai/CURRENT_HANDOFF.md`（現在地）・git commit履歴を正とする（DEC-20260721-06）。
> 着手前に実コード・DB・最新状況を再確認すること（本ファイルの記載自体が古くなっている可能性がある）。

---

## 1. ACTIVE

### High

#### BL-20260809-02: Published Study validator debt（Batch 1完了・現状値更新）

- 優先度: 高
- 状態: 対応中（Batch 1完了、残りFAIL 38件は未着手）
- 関連領域: `study_blog_posts` / `scripts/utils/study-publication-quality.ts` / `scripts/patch-study-validator-debt-batch1.ts` / `supabase/add_study_content_cas_rpc.sql`
- 現状（2026-08-10測定、Batch1A/1B production適用後の確定値）: 公開済み`study-country-*`/`study-work-*` 103件中 **PASS 65件 / FAIL 38件**（country: PASS 36/FAIL 15、work: PASS 29/FAIL 23）
- **Batch 1 milestone（完了）**:
  - Batch1A（7件: `study-work-me` / `study-country-gb` / `study-country-bg` / `study-country-de` / `study-country-be` / `study-country-nl` / `study-work-nl`）: production apply完了（commit `9b789458`のCAS RPC経由、7/7成功）
  - Batch1B（7件: `study-work-co` / `study-work-ph` / `study-country-vn` / `study-country-at` / `study-work-at` / `study-country-dk` / `study-work-dk`）: production apply完了（7/7成功）
  - 合計14記事修正、CAS failures=0、RPC errors=0、unexpected exceptions=0、**new FAIL=0**（対象外記事へのregression皆無）、`country_sources` write=0（registry新規追加なしで全14件解消）
  - 期待改善値（PASS 51→65、FAIL 52→38）と実績が完全一致
- **historical diagnosis（Batch1着手前の52件、Codexによる客観診断）**: URL mismatch only=44件、reference sectionはあるがURL0件=8件、metadata/content-length起因=0件、approved source自体0件=0件。**この内訳はBatch1前の52件時点のスナップショットであり、残り38件への単純な差し引き適用はしない**（次バッチ前に38件を再診断する）
- **registry不要という結論の範囲**: 「Batch1着手前のpublished FAIL 52件について、validator上、新規registry追加がPASS化の必須条件である記事は0件だった」という事実のみを指す。「今後country_sources拡充が不要」「Study grounding課題が全て解決した」という意味ではない（BL-20260809-04参照、registry breadth課題は別途残る）
- 対応方針: **一括修正は禁止**。Batch1の分析結果（着手前FAIL52件のうち、新規registry追加がPASS化の必須条件だった記事は0件）により、「registry拡充→再計測→patch」というregistry-first方針は残りFAILの標準手順としない。**registry拡充はcurrent validator debt解消の必須first stepではない**（registryが不要という意味ではなく、source breadth改善はBL-20260809-04として別途継続する）。残りFAIL 38件は以下の順で段階的に対応する:
  1. current production上で再分類（failure reason / confidence / minimal fixを再評価）
  2. article patch / structural fix / registry improvement / source researchのうち必要な手段を記事ごとに選択
  3. Quick Wins選定 → Batch2設計 → DRY_RUN → independent audit → production apply
- 完了条件: 段階的にFAIL件数を削減する（一度に全件へ手を付けない）
- 次のアクション: 残りFAIL 38件をcurrent production上で再分類（Quick Wins/confidence再評価）→ Batch2選定 → dry-run → 監査 → production apply、の順で段階的に進める（Batch2の即時applyは行わない）

---

### Medium

#### BL-20260809-03: Vietnam grounding（study-country-vn DONE / study-work-vn継続）

- 優先度: 中
- 状態: 部分完了（`study-country-vn`はDONE、`study-work-vn`は未着手のためActive Mediumを維持）
- 関連領域: `country_sources` / `study_blog_posts`
- **`study-country-vn`（2026-08-10 DONE、Batch1B適用）**: 旧来の前提（「registryへ`vnembassy-jp.org`を追加した上でenをtarget patchする、両方揃って初めて完了」）は**訂正**する。実際にはja/en/zh全言語が`https://xuatnhapcanh.gov.vn`の**bare root**を引用しており、registryには同domainの承認済みsub-path（`.../en/tin-tuc/procedures-temporary-residence-cards-...`）と`https://immigration.gov.vn/`が既に存在していたため、**article reference target patchのみ（registry新規追加なし）で3言語ともPASS化**した。`vnembassy-jp.org`の登録は行っていない（`country_sources`のvnエントリは既存5件のまま、総数388件不変を確認済み）
  - `xuatnhapcanh.gov.vn`はstability gate（独立GET 3/3失敗歴）があるためregistryへの新規追加候補としては引き続き慎重に扱う。ただし今回は**既存の承認済みsub-pathをそのまま引用する**方式のため、この不安定性は今回のpatchには影響していない
- **`study-work-vn`（未着手、継続）**: 2026-08-10時点でFAILのまま。approvedCount=2（`immigration.gov.vn`・`xuatnhapcanh.gov.vn`sub-path、study-country-vnと共通）だが、ja/en/zhとも`vietnamtourism.gov.vn`・`molisa.gov.vn`（労働省、work記事としては最も文脈適合的）・`vn.emb-japan.go.jp`（第三国source）・`ilo.org`・`moet.gov.vn`を引用しており、既存registryのいずれとも一致しない。study-country-vnと同型のarticle target patch（既存承認済みURLへの置換）で解消できる見込みだが、work記事の文脈上は`molisa.gov.vn`（ベトナム労働省）の新規registry登録の方が内容的に適切な可能性があり、次バッチ選定時に判断する
- 完了条件: `study-work-vn`のFAIL解消（article target patchまたはregistry追加+patch、次バッチで判断）

#### BL-20260809-04: Registry Batch 3候補（grounding source breadth improvement）

- 優先度: 中
- 関連領域: `country_sources`
- **位置づけの訂正（2026-08-10）**: Batch1の分析で、着手前のpublished FAIL 52件は**全件がalive+study/visa approved sourceを1件以上既に保有**しており、新規registry追加はBatch1の解消に不要だったことが判明した。したがって本項目は「current validator debtのblocker」ではなく、**将来の記事生成・編集品質向上のためのgrounding source breadth改善**として位置づける
- 残存事項（理由別記録、2026-08-10時点で要再確認）:
  - DE / MT: 既知候補URLがCloudflare 403でブロック（ただしDE/MTとも既存registryに複数の承認済みsourceが既にあり、現在のvalidator FAILはarticle側の引用不一致＝BL-20260809-02側のB分類が原因。Cloudflare 403の候補URLはあくまで「追加候補」であり必須ではない）
  - ME / IE: 既知候補URLが404または接続失敗
  - RS / CN: 以前「work側の候補source不足」と記録していたが、Batch1診断でRS（approvedCount=1）・CN（approvedCount=6）ともwork側にも既存approved sourceがあり、現在のFAILはarticle側の引用不一致であることが判明。**この行は訂正**（source不足ではなく記事参照ミスマッチ）
  - VN: BL-20260809-03参照。`study-country-vn`はregistry追加不要でDONE、`study-work-vn`は継続
- 完了条件: 各国について代替の公式URLを調査し、HTTP到達性・本文一致を確認したうえでユーザー承認を得てbatch登録する（現在のvalidator debtの解消条件ではなく、任意のsource breadth拡充として扱う）

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

#### BL-20260809-15: Content hash coverage hardening

- 優先度: 低
- 状態: 未着手
- 関連領域: `scripts/check-source-content-hash.ts`
- 現状（2026-08-09初回baseline実測）: alive 361件中337件（93.4%）がbaseline化、24件（6.6%）が未カバー。24件は概ね以下2種に分かれる（URLパターンからの推定、スクリプト自体が失敗理由の詳細を記録しない設計のため確証ではない）:
  - binary source: PDF / XLSX / ZIP / FileDown等のdownload endpoint（例: `ar/tax`, `mx/tax`, `my/visa`のPDF、`ch/salary`のdam-api asset、`nz/salary`のZIP、`kr/salary`のFileDown.do）
  - HTML取得失敗: anti-bot/Cloudflare・JS要求・timeout/network instability等（例: `mt/tax`×2はCloudflare既知課題と一致、`vn/visa`はstability gate既知不安定sourceと一致、他多数は個別要因不明）
- 課題: `check-source-content-hash.ts`の`fetchPageText()`はcontent-typeに`html`/`text`を含まない場合`return null`する設計（74〜75行目）のため、binary sourceは構造的にcontent hash監視の対象外になる。またHTML取得は単発GET＋Wayback fallback 1回のみで、`verify-country-sources.ts`のようなUA rotation＋3回リトライは実装されていない
- 将来検討（1つのbacklog内で検討）:
  1. binary source向けのcontent hash戦略（raw bytesハッシュ、`Last-Modified`/`Content-Length`等のmetadata監視への切替等）
  2. HTML取得失敗source向けのretry robustness改善（`verify-country-sources.ts`のUA rotation/retryロジックの再利用検討）
- 注記: BL-20260809-01（schema mismatch）とは分離した別課題。記事公開品質のblockerではないためLow
- 完了条件: 上記1・2いずれかの方針を決定し、必要なら実装する

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
- content_hash schema migration＝DONE、初回baseline実行＝DONE（2026-08-09。alive 361件中337件成功、fetch失敗24件、changed 0件、Issue作成/コメント0件、DB failure 0件。詳細は「3. DONE / ARCHIVE」のBL-20260809-01参照）
- 残るのは**次回monthly scheduled実行（2026-09-01 02:00 UTC）による本番end-to-end確認のみ**
- 確認対象:
  - full re-verify（`--recheck-dead --recheck-unverified --re-verify`）によるstatus更新
  - status更新後のaliveのみを対象としたcontent hash check
  - 既にbaseline化済みの337件が正しくchange detectionの対象になること（変化があれば初めてIssue通知経路が実際に動作する）
  - 現在hash NULLの24件（alive）が、fetch成功時に「初回記録」経路でbaseline化されること（`changed`扱いにならないこと）
  - fetch失敗が継続するsourceはNULLを維持し、次月以降も自然にリトライされること

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
| BL-20260809-01 | country_sources content_hash / content_hash_at schema mismatch | **完了**（2026-08-09）。migration commit `166ce56017f903ca65ca30238872e467b13c2766`（origin/mainへpush済み、Codex最終判定PASS WITH NOTES）。本番Supabaseへmigration適用成功、`NOTIFY pgrst, 'reload schema';`によるPostgRESTスキーマキャッシュ反映完了、`content_hash`/`content_hash_at`のSELECT成功を確認。migration直後はnon-null 0/0（backfillなしを確認）。初回baseline実行（`check-source-content-hash.ts`単体、1回のみ）: alive 361件中337件成功・fetch失敗24件・changed 0件・Issue作成0件・Issueコメント0件・DB failure 0件。content_hash/content_hash_at片側NULL異常0件（ペア整合性確認済み）。残る24件のcoverage gapはBL-20260809-15として別途分離記録 |
| BL-20260809-09 | Montenegro reference mismatch | **完了**（2026-08-10）。`study-work-me`のBatch1A production apply（commit `9b7894586a08b1abff71cf269650a8fd76bd8d20`のCAS RPC経由）でen参照セクションを`https://www.gov.me/en/ministry-of-interior`→`https://www.gov.me/en/mup`（既存registry済みURL）へtarget patch。registry変更0、CAS成功、post-update validator PASS、new FAIL 0を確認。`study-work-me`は現在PASS |

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
- 現状のvalidator PASS/FAIL: BL-20260809-02参照（103件中PASS 65 / FAIL 38、2026-08-10測定、Batch1A/1B production適用後）

---

## 6. Study validator debt Batch 1（CAS RPC）恒久記録

- 実装commit: `9b7894586a08b1abff71cf269650a8fd76bd8d20 feat: add safe study article reference patching`（origin/mainへpush済み、Codex最終判定PASS WITH NOTES、Scripts TypeCheck run成功確認済み）
- migration: `supabase/add_study_content_cas_rpc.sql`（production適用済み、PostgREST schema reload実施済み、OpenAPI上でRPC認識を確認済み）
- 実装済み機能:
  - RPC `study_blog_posts_cas_update_content(p_id uuid, p_expected_content jsonb, p_new_content jsonb) returns table(id uuid)`: `content`列専用のcompare-and-swap。id一致・`is_published=true`・content全体が期待値と完全一致する場合のみatomic UPDATE
  - `SECURITY INVOKER`・`search_path`固定・`REVOKE ALL FROM PUBLIC/anon/authenticated` + `GRANT EXECUTE TO service_role`のみ
  - `scripts/patch-study-validator-debt-batch1.ts`: 宣言的patch plan（Batch1A/1B計14件）、物理URL occurrence guard（token位置ベース、Set重複排除に依存しない）、normalized-equivalent重複検知、DRY_RUNデフォルト＋`--apply`+`ALLOW_PRODUCTION_STUDY_PATCH=1`の二重guard、APPLY時fail-fast（最初の異常でSTOP、成功済みは保持、以降はnot_attempted）、`db_updated`カウンタ（CAS成功確定後は例外が起きても巻き戻らない設計）、post-update full verification（content deep-equal・validator PASS・非content列不変・planned URL状態）
- **Batch1A production適用（2026-08-10）**: 7件（`study-work-me` / `study-country-gb` / `study-country-bg` / `study-country-de` / `study-country-be` / `study-country-nl` / `study-work-nl`）、7/7成功、db_updated=7、CAS failures=0、new FAIL=0
- **Batch1B production適用（2026-08-10）**: 7件（`study-work-co` / `study-work-ph` / `study-country-vn` / `study-country-at` / `study-work-at` / `study-country-dk` / `study-work-dk`）、7/7成功、db_updated=7、CAS failures=0、new FAIL=0
- 合計14記事修正、`country_sources` write=0（registry新規追加なしで全件解消）
- production PASS/FAIL推移: 51/52 → 65/38（country 28/23→36/15、work 23/29→29/23）、予測値と完全一致
- 残りFAIL 38件はBL-20260809-02参照（次バッチは再分類から開始）
