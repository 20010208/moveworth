# Current Handoff

最終更新: 2026-08-01
最終担当: Claude Code
タスクID: CLOSE-REMAINING-FAIL-OPEN-PATHS-20260801
状態: 修正・静的検証完了。commit予定（`d614ede`の上に追加、push未実施）。Codex監査（FAIL）指摘5件への対応完了、end-to-end実行確認は未完了。**「厳格検証済み」「完全復旧」とは表現しない**（静的検証・ローカルモックのみで実運用未確認のため）

## Git履歴（重要）

- `7ae0466`: origin/mainへpush済み。GitHub上でWorkflow定義がactiveとして正常認識されたことを確認済み
- `e4de711`: commit済み・**未push**
- `db75e51`: commit済み・**未push**
- `d614ede`: commit済み・**未push**（`db75e51`の上に追加。`e4de711`/`db75e51`はamend・rebaseしていない）。この修正に対するCodex独立監査が**FAIL**となった
- 本タスクの新commit: `d614ede`に対するCodex独立監査がFAILとなったため、その指摘5件に対応した追加commit（push未実施）
- 旧版runで作成されたIssue #1／#2の整理は本タスクの範囲外・別判断として保留（今回も一切触れていない）

### Codex監査（d614ede対象）の主なFAIL理由
1. GitHub Search APIの不完全・矛盾した応答（`total_count`不正、ページ間不整合、重複Issue番号等）を「既存Issueなし」と扱うfail-open
2. Supabase更新が0件または複数件でも成功扱いされる可能性（`.update().eq()`だけでは実際に何件更新されたか確認していなかった）
3. `verify-country-sources.ts`のstatus更新が`.eq("url", ...)`（URL条件）で行われており、同一URLを共有する別source・別国の行を意図せず更新する可能性
4. `runExtract()`の既存alive取得（`select("url").eq("status","alive")`）でSupabaseの`error`を確認していなかった
5. Issue作成APIレスポンスのtitleが要求と食い違っていても成功扱いにしていた
6. 文書と実際のcommit状態の不一致

## Fail-open経路の是正（2026-08-01 5回目）

### 対応内容（ファイル別）

**`scripts/utils/github-issue-dedup.ts`**
- Search APIの`total_count`を`isValidTotalCount()`で厳格検証（0以上1000以下の整数。`Number.isInteger()`によりNaN・小数・負数・Infinityは自動的に拒否）
- `total_count`が1ページ目と後続ページで一致することを確認（変化した場合はthrow）
- 1ページあたりのitems件数が`per_page`（100）を超えないことを確認
- `total_count=0`なのにitemsがある／`total_count>0`なのに空ページ（1ページ目含む）、を矛盾としてthrow
- 取得済み件数が`total_count`を超えた場合、および全ページ取得後に件数が`total_count`と一致しない場合もthrow
- 同一ページ内・ページ間でのIssue番号重複を検出しthrow
- 全ページを完全に取得できた場合のみタイトル完全一致判定を実施
- Issue作成レスポンスの`title`が要求時に渡した期待タイトルと完全一致することを追加検証。不一致はthrow（API上は2xxで成功していてもtitleが信頼できない場合は成功扱いにしない）

**`scripts/utils/db-update.ts`（新規）**
- `updateExactlyOneById()`: `country_sources`等の更新を`id`条件＋`.select("id").single()`で行い、Supabase自身に0件更新・複数件更新をエラーとして検知させる。加えて返却された`data.id`が更新対象と一致することも確認。`id`が空/未定義の場合はDB呼び出し自体を行わず処理エラーとする

**`scripts/verify-country-sources.ts`**
- `runRecheck()`のstatus更新を`updateExactlyOneById()`経由へ変更し、`.eq("url", ...)`（URL条件）を廃止。常に`.eq("id", ...)`で更新対象を一意に特定する（同一URLを共有する別source・別国の行を誤って更新しない）
- `runExtract()`の既存alive取得（`select("url").eq("status","alive")`）に`error`確認を追加。取得失敗時はthrowし、「0件」という正常ケースと明確に区別する。エラー時はdead-sources.json書き込み・Issue通知トリガーへ進まない
- 同ファイル内の他のSupabase呼び出し（runRecheckの初期select、runExtractのblog_posts/study_blog_posts取得、upsert）は既にerror確認済みであることを確認（変更なし・無関係な大規模リファクタリングはしていない）

**`scripts/check-source-content-hash.ts`**
- 初回hash保存・変更なし更新（immediateUpdates）、通知成功後のhash更新の両方を`updateExactlyOneById()`経由へ変更。既存の`.eq("id", ...)`という更新条件自体は元々正しかったため変更していないが、0件/複数件更新やID不一致の検知が新たに加わった

### 静的検証・モック検証の結果
- YAML構文・cron・concurrency・`workflow_dispatch`のchoice設定: 今回yamlファイルは変更しておらず、既存設定（`queue: max`・`type: choice`・cron3件）が不変であることをgrep確認
- `git diff --check`: 空行末尾等のwhitespaceエラー0件
- `npx tsc --project tsconfig.scripts.json --noEmit`: 対象5ファイル（verify-country-sources.ts / check-source-content-hash.ts / github-issue-dedup.ts / db-update.ts / notify-dead-sources.ts）ともエラー0件
- ローカルモックテスト（実DB・実GitHub API・実Issue・実Workflow実行へは一切アクセスしない）:
  - `github-issue-dedup.ts`のtotal_count厳格検証・pagination整合性・Search item schema・Issue作成タイトル検証を、実ファイルの動的import＋fetchモックで31パターン検証（正常系4：total_count=0/1/100/101・異常系：total_count=-1/0.5/NaN相当/欠落/1001、total_count=0なのにitemsあり、total_count=1なのにitems2件、2ページ目空、ページ間total_count変化、ページ間/ページ内Issue番号重複、item各フィールド欠落、PR混入、incomplete_results、非2xx/403/429、不正JSON、Issue作成の各種欠落・title不一致等）、全件OK
  - `notify-dead-sources.ts`の`notifyAll()`を実ファイルの動的import＋fetchモックで11パターン再検証（Issue作成モックがリクエストのtitleをそのまま返すよう更新）、全件OK
  - `db-update.ts`の`updateExactlyOneById()`を実ファイルの動的import＋fake Supabaseクライアントで検証: 正確に1件更新／error／dataなし／0件相当／複数件相当／ID不一致／source ID欠落（null/undefined/空文字、DB呼び出し自体が発生しないことも確認）／同じURLの別sourceが存在しても対象idのみ更新、全件OK
  - `runExtract()`のalive取得error処理を同一分岐構造のロジック同値テストで検証（成功0件／成功複数件／error時throw／error時に後続段階へ進まない／正常0件とerrorケースの区別）、全件OK
  - 前回までのDB更新エラー×終了コード優先順位（verify 5パターン・content-hash 6パターン）を再実行し、リグレッションがないことを確認

### 未解決事項・残存リスク
- 実際のGitHub Actions実行を経ていないため、動的な挙動（実際のSearch APIレスポンス形状、Supabaseの`.single()`実挙動）は未確認
- `updateExactlyOneById()`はSupabaseの`.single()`の挙動（0件/複数件でerrorになること）に依存しており、Supabaseクライアントのバージョン変更等でこの挙動が変わった場合は追従が必要
- 旧版runで作成された可能性のあるIssue #1／#2の整理・close判断は、本タスクの範囲外として保留（ユーザー判断が必要）
- pushは未実施（ユーザー承認待ち）。push後の実スケジュール実行での確認が必須

### Codex監査（db75e51対象）の主なFAIL理由
1. 月次runでdead URLがあるとcontent-hash検査がskipされる（verify-country-sources.tsがexit 2を返すと検証step自体がfailureになり、後続の暗黙のsuccess()によりcontent-hash stepがskipされていた）
2. Supabaseの更新失敗を成功扱いしている（`upErr`を警告のみで継続、または戻り値のerrorを未確認のまま成功件数へ加算していた箇所が複数あった）
3. concurrencyのpending runが3件以上で失われる（`cancel-in-progress: false`のみでは、pending保持数が実質1件までのため）
4. GitHub APIレスポンスのschema検証が不十分（`{}`やitems欠落等の不完全な応答を「既存Issueなし」と誤認しうる余地が残っていた）
5. researchのjq失敗時にfail-openとなる（jqの解析失敗を明示チェックしていなかった）
6. manual modeの不正値が成功no-opになる（自由入力＋case文のdefaultなしで、不正値でも何も実行せず成功終了していた）
7. 文書が実際のcommit状態と一致していない

## GHA Workflow失敗判定の完全化（2026-08-01 4回目）

### 対応内容（ファイル別）

**`scripts/verify-country-sources.ts`**
- `runRecheck()`のDB status更新ループで、戻り値の`error`を警告のみで継続していた箇所を修正。DB更新失敗を`dbUpdateFailures`として集計し、1件でもあれば dead URL件数に関わらず exit 1（処理障害優先）とする
- 終了コード最終契約: 全DB更新成功＋dead URLなし→0／全DB更新成功＋dead URLあり→2／DB更新失敗が1件でもあれば→1

**`scripts/check-source-content-hash.ts`**
- 初回hash保存・変更なし時の更新（immediateUpdates）ループでも戻り値の`error`を確認するよう修正（従来は完全に無視していた）
- 通知成功後のhash更新でも`error`を確認し、失敗時は成功件数へ加算しない（次回再検出される状態を維持）
- 通知失敗・DB更新失敗いずれかが1件でもあれば`process.exitCode = 1`。失敗記録にはsource id/country/urlを含め、Supabaseのエラーオブジェクト全体やsecretはログへ出力しない（`.message`のみ）

**`scripts/utils/github-issue-dedup.ts`**
- Search APIレスポンスのスキーマを厳格検証: object形状、`incomplete_results`がboolean、`items`が配列、各itemの`number`（正の整数）・`title`（string）・`html_url`（string）・pull request混入なし、を全てthrowで保証。`{}`やitems欠落を「既存Issueなし」と扱わない
- `per_page=100`を明示し、`total_count`に基づきページングを継続。GitHub Search APIの上限（1000件）に達し完全性を保証できない場合もthrow
- Issue作成API・コメントAPIも2xxのみで成功扱いせず、`number`（正の整数）/`html_url`（空でない文字列）等をレスポンスから検証し、不正な場合はthrow

**`.github/workflows/health-check-country-sources.yml`**
- weekly/monthly/manualの各検証stepで、終了コード0→dead_found=false・成功／2→dead_found=true・**成功として終了**（後続処理を継続可能にする）／その他→dead_found=false・元の終了コードで失敗、という変換を実装
- これにより月次はdead URL検出時も暗黙のsuccess()でcontent-hash stepへ進めるようになった（content-hash step自体は条件変更なし。monthly_reverifyが処理障害でfailした場合は自動的にskipされる）
- 末尾に「Fail workflow when dead URLs were detected」stepを新設。`always() && !cancelled()`かつweekly/monthly/manualいずれかの`dead_found=='true'`の場合のみ`exit 1`し、Issue通知・content-hash完了後にWorkflow全体をfailureにする
- `concurrency`を`cancel-in-progress: false`から`queue: max`へ変更（group名は不変）
- `workflow_dispatch.inputs.mode`を自由入力から`type: choice`（4値: recheck-dead/recheck-unverified/recheck-all/re-verify）へ変更。Manual dispatchステップのシェル側も`case`文の`*)`で不正値を明示的に`exit 1`させる

**`.github/workflows/research-study-abroad.yml`**
- research Issue検索に`command -v jq`チェックを追加（jq不在時はfail-closedでstepを失敗させる）
- `gh issue list`・jqのパース処理の両方を`if ! VAR=$(...); then ... exit 1; fi`パターンへ統一し、jq解析失敗を「既存Issueなしの正常な空結果」と混同しないようにした

### 静的検証・モック検証の結果
- YAML構文（js-yaml）: 両ファイルOK。IDE診断エラー0件（`queue: max`・`type: choice`を含め、追加後もエラーなし）
- cron無変更、`if:`内`secrets`直接参照なし、`cancel-in-progress`残存なしをgrep確認
- 全14個の`run:`ブロックを`bash -n`で構文チェック、全件OK
- `npx tsc --project tsconfig.scripts.json --noEmit`: 対象4TSファイルともエラー0件
- ローカルモックテスト（実DB・実GitHub API・実Issue・実Workflow実行へは一切アクセスしない）:
  - `github-issue-dedup.ts`のschema検証・paginationを実ファイルの動的importとfetchモックで21パターン検証（Search正常/既存なし/既存あり/`{}`/items欠落/number欠落/title欠落/PR混入/incomplete_results/非2xx/rate limit/不正JSON/pagination複数page/per_page=100明示/Issue作成成功・number欠落・html_url欠落・非2xx/コメント成功・id欠落・html_url欠落・非2xx）、全件OK
  - `notify-dead-sources.ts`の`notifyAll()`を実ファイルの動的importとfetchモックで11パターン再検証、全件OK
  - verify-country-sources.tsのDB更新エラー×終了コード優先順位を5パターンのロジック同値テストで検証、全件OK
  - check-source-content-hash.tsのDB更新エラー処理（初回保存/通知後更新/部分成功）を6パターンのロジック同値テストで検証、全件OK
  - health-check-country-sources.ymlのexit 0/2/その他 → dead_found + step自身の終了コード変換ロジックを、実際のシェルスニペットと同一構造のbashスクリプトで4パターン検証、全件OK
  - Manual dispatchの`case`文を実際のシェルロジックと同一構造で6パターン検証（4正規mode＋不正mode＋空文字mode）、全件OK
  - research-study-abroad.ymlの「Create GitHub Issue with research report」stepの`run:`ブロックを**実ファイルからそのまま抽出**し、fakeの`gh`/`jq`実行ファイルをPATHに配置して6パターン検証（gh検索失敗／jq不在／jq解析失敗／既存Issueなし新規作成／既存Issueありskip／gh作成失敗）、全件OK
- `queue: max`はGitHub公式ドキュメントでの一次情報確認ができていない（インターネットアクセスなし）。IDE診断ではエラー0件だったが、これは「エラーとして検出されなかった」ことの確認であり、フィールドの完全な正当性を一次情報で保証するものではない

### 未解決事項・残存リスク
- 実際のGitHub Actions実行を経ていないため、動的な挙動（特に`queue: max`の実際の効果、weekly/monthly/manualの3件以上同時トリガー時の挙動）は未確認
- GitHub Actions自体はSearch→Create/Commentを完全な原子操作にはできないため、concurrencyによる直列化があっても同時実行の完全排除ではない
- 旧版run（過去の`if: failure()`ベースの実装）で作成された可能性のあるIssue #1／#2の整理・close判断は、本タスクの範囲外として保留（ユーザー判断が必要）
- pushは未実施（ユーザー承認待ち）。push後の実スケジュール実行での確認が必須

## GHA Issue通知の構造的是正（2026-08-01 3回目）

### 経緯
`e4de711`（Issue通知の重複防止・secretスコープ縮小等）に対するCodexの独立再監査が再度FAILとなり、以下13件の実行時問題が指摘された。
1. research Issue検索が`--json title`のみ取得しつつ`.number`を参照しており、既存Issue番号を常に取得できない設計不具合
2. health-checkのschedule判定が`contains()`による部分一致で、weekly/monthly処理の境界が曖昧
3. dead URL判定が自然言語ログのgrepに依存しており、ログ文言変更に弱く、DB接続失敗等の他要因の失敗と本質的に区別不能
4. dead URL検出の詳細が機械可読な形で残らず、Workflow側が対象を個別に識別できない
5. health-check Issueが固定タイトル1件に集約されており、異なる国・URLの通知を1件のskip判定が抑止してしまう設計
6. 同一Workflowのweekly/monthly/manualの同時実行に対する排他制御がない
7. source content hash通知も固定タイトル1件に集約されており、source Aのissueがsource Bの通知を抑止する設計
8. source content hashをGitHub通知の成否に関わらず即座にDB確定保存しており、通知失敗時に次回再検出できない
9. monthly再検証コマンドの`--re-verify`がverify-country-sources.ts側の分岐順序により無視され、実際にはalive未検証のままだった
10. research Issueが既存open issueによりskipされた場合も、SendGridメールが毎回再送される設計
11. SendGridの成功/失敗/skip時の期待動作が仕様として明文化されていない
12. 静的検証・機械テストの不足
13. 運用文書がpush実態・ラベル状況・監査結果を反映していない

### 対応内容（ファイル別）

**`scripts/verify-country-sources.ts`**
- 終了コード契約を新設: `0`=正常・dead URLなし / `2`=検証正常完了・dead URLあり / `1`その他=処理失敗。`runRecheck()`・`runExtract()`双方で統一
- dead URL検出時、`.tmp/country-source-health/dead-sources.json`へ機械可読レポート（id/countryCode/category/url/reason/checkedAt）を書き出す。検証が正常完了した経路でのみ書く（DB接続失敗等では偽造しない）。dead URLなしでも空配列を明示的に書く
- `main()`の分岐順序を修正し、`--re-verify`を最優先分岐にして`["alive","dead","unverified","unknown"]`を対象にするよう変更。従来はmonthlyの`--recheck-dead --recheck-unverified --re-verify`呼び出しで`--re-verify`が無視され、aliveが再検証されていなかった（週次の対象範囲は無変更）

**`scripts/utils/github-issue-dedup.ts`（新規）**
- `stableSourceKey(id, url)`: `country_sources.id`優先、なければ正規化URLのSHA-256ハッシュ（8桁）でsource単位の安定キーを生成
- `searchOpenIssueByExactTitle` / `createIssue` / `addIssueComment`: GitHub API呼び出しを共通化。非2xx・`incomplete_results=true`・不正JSONはすべてthrow（fail-closed。「検索できない」を「既存なし」と混同しない）

**`scripts/notify-dead-sources.ts`（新規）**
- dead-sources.jsonを読み、source単位（`[country-sources][source:<ID>] dead URL`または`[country-sources][url:<HASH>] dead URL`）でGitHub Issueへ通知
- 同一sourceのopen issueがあればコメント追加、なければ新規作成。異なるsourceは互いに抑止しない
- 通知失敗はsource単位で記録し、1件でも失敗すれば最終的に非ゼロ終了（stepを失敗させる）

**`scripts/check-source-content-hash.ts`**
- 固定タイトル1件（`[country-sources] ソース更新検知`）を廃止し、`github-issue-dedup.ts`を使ったsource単位通知（`[country-sources][source:<ID>] ソース更新検知`等）へ変更
- DB `content_hash`更新順序を是正: 「変化なし・初回記録」は即時保存、「変化あり」は**GitHub通知が成功した場合にのみ**該当sourceのDB hashを更新。通知失敗時は更新せず次回再検出させる。他sourceの成功済み更新をロールバックしない
- `main().catch(console.error)`を`process.exitCode = 1`を設定する形へ変更（黙って終了コード0にしない）

**`.github/workflows/health-check-country-sources.yml`**
- `concurrency: {group: health-check-country-sources, cancel-in-progress: false}`を追加し、weekly/monthly/manualを直列化
- weekly/monthlyの`if:`条件を`contains(github.event.schedule, ...)`の部分一致から`github.event.schedule == '0 1 * * 6'` / `'0 2 1 * *'`の完全一致へ変更
- Weekly/Monthly/Manualの各ステップの終了コード（0/2/その他）を判定し`dead_found`をstep outputへ記録（grepマーカーではなくverify-country-sources.tsの終了コードで判定）。元の終了コードはそのまま伝播させ、Workflow失敗判定は隠していない
- 旧「Create GitHub Issue on dead URL detection」（github-script・固定タイトル1件）を削除し、`scripts/notify-dead-sources.ts`を呼ぶ「Notify dead sources」ステップへ置き換え

**`.github/workflows/research-study-abroad.yml`**
- research Issue検索を`--json number,title`＋`--limit 100`へ修正し、jqで完全一致判定（旧`--json title`+`.number`参照は常にnullになるバグだった）。検索コマンド自体の失敗は`head`等で隠さずstepを失敗させ、Issue作成へ進まないようにした
- Issue作成ステップから`created=true/false`と`issue_url`をoutputし、SendGrid送信条件へ`steps.research_issue.outputs.created == 'true'`を追加（既存issueによりskipした場合はメールも再送しない）
- SendGridの期待動作（未設定=skip成功／設定あり失敗=Workflow失敗／reportなし=送信なし／既存issueでskip=送信なし／新規issue作成時のみ送信）をコメントとして明文化

**`.gitignore`**
- `/.tmp/`を追加（dead-sources.json等の一時出力がcommit対象に混入しないようにするため）

### 静的検証・モック検証の結果
- YAML構文（js-yaml）: 両ファイルともOK。IDE診断エラー0件
- cron値: 無変更（`0 0 * * 6` / `0 1 * * 6` / `0 2 1 * *`）を確認
- schedule完全一致: `contains(github.event.schedule` の残存なしをgrep確認
- concurrency: `health-check-country-sources.yml`に設定済みを確認
- `if:`条件・job-level envに`secrets`直接参照が残っていないことを確認
- 全13個の`run:`ブロックを抽出し`bash -n`で構文チェック、全件OK
- `npx tsc --project tsconfig.scripts.json --noEmit`: 変更対象4ファイル（verify-country-sources.ts / check-source-content-hash.ts / notify-dead-sources.ts / github-issue-dedup.ts）ともエラー0件
- ローカルモックテスト（実DB・実GitHub API・実Issueへは一切アクセスしない）:
  - `main()`の分岐選択ロジック（monthly=alive含む全件、weekly=従来通り等）を6パターン検証、全件OK
  - 終了コード契約（dead 0件→0、dead N件→2、例外→1）を4パターン検証、全件OK
  - dead-sources.jsonのスキーマ（必須フィールド・空配列表現）を検証
  - `notify-dead-sources.ts`の`notifyAll()`をfetchモックで11パターン検証（新規作成／既存へコメント／検索非2xx／rate limit／incomplete_results／不正JSON／作成失敗／コメント失敗／idなしのハッシュキー生成／異なるsourceの別Issue化／同一sourceの同一Issue化）、全件OK
  - DB hash更新順序（全件成功／部分失敗／全件失敗／変化なし即時更新）を4パターン相当ロジックで検証、全件OK
- jqコマンド自体はこのローカル環境（Windows/Git Bash）に未インストールのため実行できず、フィルタロジックの等価性のみNode.jsで確認した（GitHub-hosted ubuntu-latestランナーにはjqがプリインストールされている前提）

### 未解決事項・残存リスク（次回Codex再監査で重点確認すべき点）
- 実際のGitHub Actions実行を経ていないため、`notify-dead-sources.ts`・`check-source-content-hash.ts`のGitHub API呼び出し・`research-study-abroad.yml`のjq処理の実行時動作は未確認
- `dead_found`判定は終了コードベースに変更したが、`verify-country-sources.ts`の将来的な変更で終了コード契約が崩れるリスクは残る（コード側にコメントで明記済み）
- 同一Workflow内のconcurrency直列化はできたが、GitHub Actions自体がSearch→Create/Commentを完全な原子操作にはできない制約は残る（同時実行が完全に排除されるわけではない）
- pushは未実施（ユーザー承認待ち）。push後の実スケジュール実行での確認が必須

## GHA Issue通知経路の是正（2026-08-01 2回目）

### 経緯
commit `7ae0466`（push済み、origin/mainに反映済み・GitHub上でWorkflow定義がactiveとして正常認識されたことを確認済み）に対するCodexの独立監査結果がFAILとなり、以下6件の実行時問題が指摘された。8/1定期実行前に最小変更で対応。

### Task 1: 不足ラベルの作成
- `gh label list`で`content`・`source-updated`が存在しないことを確認（既存はGitHubデフォルト9種のみ）
- `gh label create`で2件作成（`content`: #1D76DB、`source-updated`: #0E8A16）。既存ラベルの削除・改名は一切行っていない
- 作成後`gh label list`で再確認、2件とも存在を確認済み（Issue自体は作成していない）

### Task 2: health-check-country-sources.ymlのIssue通知条件を限定
- 実コード確認：`verify-country-sources.ts`はdead URL確定時のみ`console.log("...件の dead URL があります")`を出力してから`process.exit(1)`する。DB接続失敗等の他要因の例外も`main().catch()`経由で同じくexit(1)になるため、旧来の`if: failure()`だけでは区別不能だった
- `Weekly`/`Monthly full re-verify`/`Manual dispatch`の3ステップに`id`を付与し、出力を`tee`で捕捉した上でマーカー文字列の有無により`dead_found=true/false`をstep outputへ明示的に記録（`set +e`+`PIPESTATUS[0]`で元のexit codeは変更せず維持＝Workflow全体の失敗判定は隠していない）
- Issue作成ステップの条件を`always() && (steps.weekly.outputs.dead_found=='true' || steps.monthly_reverify.outputs.dead_found=='true' || steps.manual.outputs.dead_found=='true')`へ変更。npm ci失敗・DB接続失敗ではdead_found=falseまたはstep自体がskippedとなりIssue作成に到達しない
- `verify-country-sources.ts`・`check-source-content-hash.ts`本体のDB更新仕様・検証ロジックは無変更

### Task 3: Issue重複防止
対象3経路すべてに、作成前に同一タイトルのopen issueを検索し、あれば新規作成をskipする最小実装を追加（closedは対象外＝ブロックしない）:
- `research-study-abroad.yml`: `gh issue list --state open --search`で完全一致タイトルを確認（元々タイトルに日付なし）
- `health-check-country-sources.yml`: タイトルから日付を削除し`[country-sources] dead URL 検出`で固定。`github.rest.search.issuesAndPullRequests`で完全一致確認
- `check-source-content-hash.ts`: タイトルから日付・件数を削除し`[country-sources] ソース更新検知`で固定。GitHub Search API (`/search/issues`)への直接fetchで完全一致確認する`findOpenIssueByExactTitle()`を追加
- いずれもstep summary/ログへ「既存Issue #番号 が open のためskip」を記録

### Task 4/5: SendGrid secretのスコープ縮小・失敗検知
- job-level envから`SENDGRID_API_KEY`/`NOTIFY_EMAIL`を削除。新設した`Check email configuration`ステップ（step-level envで両secretを受け取り、値は出力せず`enabled=true/false`のみ出力）を経由し、メール送信ステップは`steps.email_config.outputs.enabled=='true'`の場合のみ実行
- checkout/setup-node/npm ci/調査スクリプトへはSendGrid系secretを一切渡さない
- メール送信ステップの`curl`を`-s`単体から`--fail-with-body --silent --show-error`へ変更し、SendGrid HTTP 4xx/5xxがcurlの非0終了コード経由でWorkflow失敗として検出されるようにした（デフォルトのbash `-e`により自動的にstep失敗へ伝播）
- APIキー・メールアドレス・Authorizationヘッダーは`-v`/`-i`等を使用していないためcurl自体はログへ出力しない（GitHub側の秘密値自動マスキングも従来通り有効）

### Task 6: ラベル参照の整合性確認
- research Issue: `--label "content"` ✓　health-check Issue: `labels: ['bug', 'content']` ✓　source content hash Issue: `labels: ["content", "source-updated"]` ✓
- 大文字小文字・空白・ハイフンの相違なし、Task1で作成したラベル名と完全一致を確認済み

### Task 8: 静的検証結果
- YAML構文：js-yamlで両ymlとも解析成功。IDE診断エラー0件
- `check-source-content-hash.ts`：`npx tsc --project tsconfig.scripts.json --noEmit`でファイル固有のエラー0件（出力中の他エラーは全て既存の未追跡scratchスクリプト由来で無関係、対象外）
- `if:`条件・job-level envに`secrets`直接参照が残っていないことをgrep確認
- 全12個の`run:`ブロックを抽出し`bash -n`で構文チェック、全件OK
- `gh issue list --search`（読み取り専用）とGitHub Search API `/search/issues`（読み取り専用fetch）を実際に実行し、コマンド・エンドポイントが正常応答することを確認（0件=既存issueなし、Issue作成はしていない）
- `content`/`source-updated`ラベルの存在を`gh label list`で再確認
- cronは無変更（`0 0 * * 6` / `0 1 * * 6` / `0 2 1 * *`）
- `git diff`で意図した変更のみであることを確認。記事公開・DB書き込み・Issue作成は実施していない

### 未解決事項・残存リスク
- `actions/github-script`内のJS（Issue検索・作成ロジック）とcheck-source-content-hash.tsのSearch API呼び出しは、実際のWorkflow実行を経ないと完全な動作確認はできない。次回スケジュール実行（8/1 09:00 JST・10:00 JST週次・次回月次）での挙動確認が必要
- 今回のIssueタイトル安定化（日付除去）により、`check-source-content-hash.ts`は「ソース更新検知」という単一の生きたopen issueが存在する限り、対象国が異なる新たな変化があっても新規issueを作成しない設計になった。長期的には対象を区別する識別キー設計が必要になる可能性があるが、今回は重複防止を優先し最小変更とした
- pushは未実施（ユーザー承認待ち）

## GHAワークフロー修正（2026-08-01）

### 目的
2026-08-01(土)09:00 JST定期実行前に、前日の読み取り専用監査で発見した2件のGHA不具合を解消。

### Task 1: research-study-abroad.ymlの0秒即失敗の原因特定・修正
- **根拠**: VSCode IDE診断（GitHub Actions YAMLスキーマ検証）で `line 71, column 13: Unrecognized named-value: 'secrets'` を確定的に検出。原因は`if: steps.check.outputs.exists == 'true' && secrets.SENDGRID_API_KEY != ''`（71行目）—GitHub Actionsの`if:`条件式は`secrets`コンテキストを直接参照できない仕様（`env`/`with`/`run`は可、`if`は不可）
- 全13ワークフロー中、`if:`内で`secrets.*`を直接参照していたのはこのファイルのみ（grep確認済み）。YAML構文自体はjs-yamlで解析可能なため、GitHub Actions固有のスキーマ制約であることを確認
- **修正**: job-level `env:`（`SENDGRID_API_KEY`/`NOTIFY_EMAIL`）を新設し、該当ステップの`if:`を`env.SENDGRID_API_KEY != ''`参照へ変更。ステップ側の重複env定義は削除（job-level envで全ステップに伝播するため実質的な動作は不変）
- Workflowの目的（土曜09:00 JST・留学国調査・GitHub Issue化・DB書き込みなし・記事公開なし）は変更していない

### Task 2: 権限（permissions）の明示的付与
- `research-study-abroad.yml` / `health-check-country-sources.yml`の両方に`permissions: {contents: read, issues: write}`を追加
- 両ファイルとも実処理を確認した結果、`actions/checkout`（read）と`gh issue create`/`github.rest.issues.create()`（issues: write）のみで、他のGitHub API操作なし。`write-all`等の過剰権限は使用していない
- `health-check-country-sources.yml`の直近失敗（`HttpError: Resource not accessible by integration`）はこの権限未設定が原因と推定（デフォルトのGITHUB_TOKEN権限では`issues: write`相当が不足）

### Task 3: 静的検証結果
- YAML構文: js-yamlで両ファイルとも解析成功
- GitHub Actionsスキーマ: IDE診断で両ファイルともエラー0件（修正前は該当行でエラー検出済み）
- cron: `0 0 * * 6`（UTC）= 2026-08-01 09:00 JST（土）であることをNode.js Dateで機械確認
- `${{ }}`式: 両ファイル内の全式を目視確認、`if:`内に`secrets`参照は残存していないことをgrepで確認
- シェル構文: 両ファイルの全11個の`run:`ブロックを抽出し`bash -n`で構文チェック、全件OK
- 差分: `git diff`で意図した変更のみ（permissions追加2箇所、job-level env追加1箇所、if:条件変更1箇所、重複env削除1箇所）であることを確認。cron・DB書き込みスクリプト・Issue本文・公開ロジックは無変更
- Workflow実際の実行・Issue作成は一切行っていない（禁止事項として遵守）

### 未解決事項・残存リスク
- IDE診断とドキュメント上の既知制約（GitHub Actions公式：secretsコンテキストはif:で不可）による推定であり、`actionlint`等の完全なオフライン機械検証はできなかった（インストール不可・インターネット経由の検証も不可）。**確実な検証は2026-08-01 09:00 JSTの実スケジュール実行を待つ必要がある**
- `research-study-abroad.yml`が過去に一度もスケジュール実行に成功したことがない（2026-07-29作成以降、push起因の即時失敗のみ）ため、今回の修正後の初回スケジュール実行の結果を必ず確認すること
- pushしていないため、リモート（GitHub Actions側）にはまだ修正が反映されていない。**8/1 09:00 JSTに間に合わせるにはユーザー承認によるpushが必要**

## サムネ設定（2026-07-30 6回目）

- Storage上の`Mets-Virtual-Office/mets-virtual-office-overseas-japanese-guide-2026.png`（ユーザー提供済み）を`compress-thumbnail.ts`で圧縮（1954KB→377KB）
- `blog_posts.thumbnail`をターゲットパッチ更新（is_published/title/description/content不変を確認）
- 実ページのHTMLを取得し、`<meta property="og:image">`が新しいサムネイルURLを指していることを直接確認（公開済みのため実際に検証可能）
- `blog_posts`にはstudy_blog_postsのような`thumbnail_ja/en/zh`列は存在せず、単一の`thumbnail`列がOGP含め全言語共通で使われる（既存仕様、今回変更なし）
- `inspect-all-blog-posts.ts`: 全100件（公開97）構造不正0件

## 画像追加・公開（2026-07-30 5回目）

`scripts/add-images-and-publish-mets-virtual-office.ts`（新規）で実施:
1. Storage上の既存画像3枚（`Mets-Virtual-Office/mets-features.png`・`mets-plan-pricing.png`・`mets-plan-comparison.png`）を`prepareCompressedThumbnail`で圧縮（325KB→71KB / 393KB→88KB / 201KB→72KB）
2. 全言語のcontentへ指定位置に画像を挿入（features: 導入部アフィリエイトリンク直後＝「METSバーチャルオフィスとは」系見出し直前／pricing・comparison: 「プラン別の特徴と料金」系見出し直後、この順）
3. `is_published`を`false→true`へターゲットパッチ（再生成なし）で公開
4. HTTP 200確認・対象外blog_posts 99件の完全不変を機械比較で確認

**注**: thumbnail（OGP）設定は今回のユーザー指示に含まれていなかったため未実施（前の中断されたメッセージには含まれていたが、今回の実行版指示には無かったため対象外とした）。ユーザー確認が必要な場合はBACKLOG化または追加指示を待つ。

検証: is_published/title/description/category/is_promotion/locales/pinned/thumbnail不変（content挿入時点）、公開後content/title不変、`inspect-all-blog-posts.ts`異常0件（100件、公開97）、`check-published-slugs-http.ts`全97件200

## 追加修正（2026-07-30 4回目）

`scripts/update-mets-virtual-office-content-v3.ts`で以下2点を反映（アフィリエイトhrefは変更していない）:
1. 郵便表現の強化：「受取不可の場合があります」→「受取できません」（全言語、断定表現へ強化）
2. EN/ZHのCTAリンク表示テキストを翻訳：EN "Click here for the METS Virtual Office official website" / ZH "点击这里前往METS虚拟办公室官方网站"（JAは「都心格安のバーチャルオフィス【METSバーチャルオフィス】」のまま維持）

検証: is_published/title/description/category/is_promotion/locales/pinned不変確認、アフィリエイトhref（全言語2箇所）・トラッキングピクセル（全言語1箇所）は変更なしを確認、`inspect-all-blog-posts.ts`異常0件

## 追加修正（2026-07-30 3回目）

ユーザー指摘の3点＋軽微問題を対象限定パッチで反映（アフィリエイトリンクは変更していない）:
1. JA本文をタグ除去後6000字以上に補完（5186字→6160字）：「海外在住者がバーチャルオフィスを選ぶ際のポイント」セクションを新規追加（EN/ZHも同様に追加）
2. 必要書類（契約者本人確認書類・代理人本人確認書類・委任状・法人契約時の履歴事項全部証明書）を「申し込み方法」セクションとFAQ Q1の両方に全言語で追記
3. 郵便物の誤認表現を修正：「安全かつ確実に管理」「安心して預けることができます」等の断定表現を、「本人限定受取郵便・特別送達・裁判文書等は受取不可の場合がある」旨の正確な表現へ修正
4. 軽微問題：「ネットショップラン」→「ネットショッププラン」（正式名称）に修正、PR表記に「本リンク経由での申込みにより当サイトに報酬が発生する場合があります」を冒頭・末尾の両方に追記

検証: 全ての文字列置換を出現回数アサーション付きで実施（想定外の箇所は例外で検出される設計）。is_published/title/description/category/is_promotion/locales/pinned不変確認、アフィリエイトhref・トラッキングピクセルは変更なしを確認、`inspect-all-blog-posts.ts`異常0件

## 追加修正（2026-07-30 2回目）

ユーザー指摘の7点を`scripts/update-mets-virtual-office-content.ts`（新規）で反映:
1. アフィリエイトリンクをA8計測リンクへ差し替え（新href・新ラベル、全言語2箇所ずつ）、トラッキングピクセルを各言語末尾に1回追加
2. 日本在住代理人条件を導入部・申し込み方法・FAQ Q1の3箇所に追記（全言語）
3. ライトプランの説明を「住所だけ」に修正、郵便受取・法人登記・転送不可を明記
4. 銀行口座維持・サービス継続利用の断定表現を「金融機関/事業者の規約・審査による」旨の表現へ修正
5. タイトルを中立表現に変更
6. 「会員継続率98%超」→「公式サイトでは2018〜2022年の自社データとして約98%と紹介」に変更（description含む）
7. 「注意事項・免責」セクションを追加し、JA本文をタグ除去後5000字以上に補完（5186字）

検証: is_published/category/is_promotion/locales/pinned不変確認、新href全言語2箇所以上・旧href残存0・トラッキングピクセル1回・代理人記載3箇所以上を機械確認、`inspect-all-blog-posts.ts`異常0件

## 目的

新規アフィリエイト記事「METSバーチャルオフィス」を`blog_posts`へ作成する。

- スラグ: `mets-virtual-office-overseas-japanese-guide-2026`
- カテゴリ: money、is_promotion: true
- 言語: JA（5000字以上）/EN/ZH
- `is_published: false`（draft保存のみ）
- アフィリエイトリンク: `<a href="https://vo-metsoffice.jp/" rel="nofollow">METSバーチャルオフィス公式サイトはこちら</a>`（href・表示テキスト変更禁止）
- リスティングNGワード対応: 「METSオフィス」という略称は使わず、常に「METSバーチャルオフィス」と表記する

## 事前確認

- 同slugの既存レコードなしを確認済み
- `CLAUDE.md`セクション7のPROTECTED_SLUGSに本スラグを追加済み（未commit）
- アフィリエイトリンクは`<!-- html -->`ブロックで囲んで実装（過去のsuika-vpn/miricanvasタスクで確立した、blog-post-content.tsxのレンダラー仕様に合わせるための必須対応）

## 本タスクでの変更予定

- `scripts/post-mets-virtual-office-article.ts`（新規）でdraft insert
- `blog_posts`: slug, category:money, published_at, reading_minutes, thumbnail:null, title/description/content(ja/en/zh), locales:["ja","en","zh"], pinned:false, is_published:false, is_promotion:true
- 本文に作成日「2026年7月30日」を目視確認できる形で記載
- assertBlogPayload通過確認、アフィリエイトhref出現回数（本文中+末尾で2箇所以上）確認
- 禁止パターン・example.com混入チェック

## 変更した主要ファイル

- `CLAUDE.md`（セクション7 PROTECTED_SLUGS追加、未commit）
- `.ai/CURRENT_HANDOFF.md`
- （予定）`scripts/post-mets-virtual-office-article.ts`（新規）
- DB（予定）: `blog_posts`に1件、is_published:false

## Git状態

- `CLAUDE.md`: 本タスクでの追加（未commit）
- 既存の対象外差分（tsbuildinfo、未追跡一時スクリプト群等）は継続・不変

## 実行済みの検証

1. `npx tsc --project tsconfig.scripts.json --noEmit`: エラー0件
2. `npx tsx scripts/post-mets-virtual-office-article.ts`: assertBlogPayload通過・insert成功
   - JA 5015字 / EN 10367字 / ZH 3693字（JA5000字要件を満たす。初回4488字だったため「こんな海外在住者におすすめ」セクションを追加して拡充）
3. アフィリエイトhref出現回数（全言語2回以上）、禁止パターン・example.com混入0件、NG略称「METSオフィス」混入0件、作成日「2026年7月30日」記載を確認
4. `inspect-all-blog-posts.ts`: blog_posts 100件（公開96・非公開4）構造不正0件
5. DB再取得で `category:money` / `is_published:false` / `is_promotion:true` / `locales:[ja,en,zh]` を確認

## 未解決事項

- なし（本タスク範囲内）

## 次に行う作業

1. JA本文をユーザーにレビュー提示済み
2. ユーザー承認後、公開判断（このセッションでは公開しない）

## 禁止事項・注意事項

- アフィリエイトリンクのhref・表示テキストは変更・削除禁止
- 「METSオフィス」という略称は使用しない（「METSバーチャルオフィス」のみ使用）
- 承認前に is_published を true にしない

## ユーザー判断が必要な事項

- JA本文レビュー・承認
- 公開可否・タイミング
