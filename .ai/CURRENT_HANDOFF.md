# Current Handoff

最終更新: 2026-08-01
最終担当: Claude Code
タスクID: RECORD-TYPECHECK-RECOVERY-20260801
状態: 実装基準のorigin/mainは`5615464`。現在のlocal HEADには、Scripts TypeCheck復旧結果を記録した文書同期commitが1件存在し、commit済み・未pushのためahead 1 / behind 0。Codexの文書差分監査はGit現在地の記述不整合2件（local HEAD／origin/mainが同一と誤記／ahead-behindを`0/0`と誤記）によりFAILとなり、今回amendで訂正する。**Scripts TypeCheck（BL-20260801-07）は実CI run `30697986179`（conclusion=success）により復旧確認が完了**しており、TypeCheck復旧・CI run・BACKLOG・Workflow・Issueに関する技術的記録には問題ない。Codex最終判定（実装commit`5615464`自体に対する監査）は`PASS WITH NOTES`（push前必須修正なし）。**「GitHub Actions全体が完全復旧」ではない**——`Research Study Abroad Entry`・`Health Check — Country Sources`の実スケジュールend-to-end確認、および旧版run（head SHA `7ae0466`）で作成されたIssue #1／#2の整理は依然として未完了。再監査で`PASS`または`PASS WITH NOTES`となった後に通常pushを予定する。

## Scripts TypeCheck復旧の確定記録（2026-08-01 7回目）

### 修正commit
- `5615464 fix: resolve scripts typecheck errors`（origin/mainへpush済み）
- 修正内容は2種類に区別される:
  - **9ファイル**（`_calc-b1b2b3-correction.ts`・`_check-b4-sources.ts`・`_check-hu-cp04.ts`・`_check-pt-cz-cp041.ts`・`_check-study-work-urls.ts`・`_check-tr-mukerrer.ts`・`_fetch-b4-data.ts`・`_fetch-eurostat-hbs4.ts`・`_fetch-eurostat-ses22-v3.ts`）: 末尾に`export {};`を1行追加し、TypeScriptが「スクリプト」として扱うグローバルスコープ上の関数・変数名衝突を解消。`_fetch-eurostat-hbs4.ts`の`TS2339`もこのグローバル衝突の派生エラーだったため、`export {};`追加のみで消滅した
  - **`_patch-ar-tax-brackets.ts`（1ファイル）**: 3つの正規表現からdotAllの`s`フラグを削除し`.*?`を`[\s\S]*?`へ変更（ES2017互換化）。Supabase接続処理・対象slug・JA/EN/ZH本文更新ロジック等のDB更新処理自体は変更していない
- `tsconfig.scripts.json`への新規exclude追加はなし。追跡済みスクリプトを型検査対象から除外しない直接修正方式を最終採用した

### 検討の経緯（採用しなかった案）
1. **広域exclude案**（`tsconfig.scripts.json`に`"scripts/_*.ts"`を追加）: 追跡済み133件を一括除外してしまい、DB更新・公開・削除・seed・migration等を実行可能なスクリプトまで型検査対象外になるため、Codex監査で`FAIL`
2. **既知10件の個別exclude案**: 残り123件は型検査可能だったが、DB更新可能な`_patch-ar-tax-brackets.ts`を含む10件を検査対象外にする方針自体が採用されず、Codex監査で`FAIL`
3. **直接修正案（最終採用）**: 上記の通り9件へ`export {};`、1件を正規表現ES2017互換化。追跡済み223件のうち既存exclude2件を除く221件全てが引き続き型検査対象。Codex最終監査は`PASS WITH NOTES`

### GitHub Actions実run
```text
Workflow: Scripts TypeCheck
run ID: 30697986179
event: push
head SHA: 56154647b34caac57d1c61950651edeff051e869
branch: main
status: completed
conclusion: success
```
全step成功（Set up job／checkout@v4／setup-node@v4／npm ci／`TypeCheck scripts/`／post steps／Complete job）。実行コマンドは`npx tsc --project tsconfig.scripts.json --noEmit`。旧エラー`TS2393`／`TS2451`／`TS2339`／`TS1501`はいずれも再発していない。

### Workflow状態
`Scripts TypeCheck`／`Research Study Abroad Entry`／`Health Check — Country Sources`の3Workflowはすべて`state: active`かつ正しい表示名を維持。head SHA `5615464`で起動したWorkflowは`Scripts TypeCheck`の1件のみ（他の2Workflowは`on: push`トリガーを持たないため起動していない）。

### 残存課題（未完了のまま）
- `Research Study Abroad Entry`の実スケジュールend-to-end確認（次回土曜09:00 JST実行）
- `Health Check — Country Sources`の実スケジュールend-to-end確認（次回週次/月次実行）
- 旧版run（head SHA `7ae0466`）で作成されたIssue #1／#2の整理（今回も未操作、open状態のまま存在を確認済み）
- 新しい`scripts/_*.ts`スクリプトが将来追加された際、同種のグローバルスコープ衝突を機械的に防ぐ仕組みは未導入（`export {};`は今回の9件へ個別追加したのみ）
- 未追跡scratchファイルが存在するローカル環境では、通常の`npx tsc --project tsconfig.scripts.json --noEmit`が引き続き失敗する運用上の課題は残る（Git追跡済み限定のCI環境でのみクリーンになる設計のため）

## Git履歴（重要）

- `7ae0466`〜`66b6e38`（`7ae0466`→`e4de711`→`db75e51`→`d614ede`→`66b6e38`）: **すべてorigin/mainへpush済み**
- GitHub上で`research-study-abroad.yml`（表示名: Research Study Abroad Entry）・`health-check-country-sources.yml`（表示名: Health Check — Country Sources）とも`state: active`として正常認識されていることを確認済み。ファイルパス表示への劣化なし
- `health-check-country-sources.yml`の`concurrency: queue: max`を含む定義がGitHub側で正常に認識されていることを確認済み（ワークフローが`active`かつ表示名が正しいことが根拠。実際のpending-queue挙動そのものは複数トリガーの実発生を経ておらず未確認）
- push自体によって`research-study-abroad.yml`・`health-check-country-sources.yml`が自動起動した事実はなし（いずれも`on: push`トリガーを持たないため）。別の既存ワークフロー`Scripts TypeCheck`（`on: push`で`scripts/**/*.ts`変更時に起動する仕様）は今回pushした4commit（`e4de711`〜`66b6e38`）で起動し失敗したが、原因はこれら4commitとは無関係な既存のコミット済みscratchスクリプト（詳細は本ファイル下部「Scripts TypeCheck読み取り専用監査」参照）
- Issue #1／#2は、head SHA `7ae0466`で実行された旧集約通知実装の週次run（run ID `30683910156`、2026-08-01T04:25:19Z、conclusion=failure）・月次run（run ID `30685732548`、2026-08-01T05:23:15Z、conclusion=failure）によって作成された。「`7ae0466`より前」「適用前」「旧commit」ではなく、**`7ae0466`そのものに含まれていた旧集約通知実装**が原因である。整理は本タスクの範囲外・別判断として保留（今回も一切操作していない）
- **実際のGitHub Actionsスケジュール実行によるend-to-end確認（dead URL検出→source単位Issue通知→DB更新、SendGrid通知の実動作等）はまだ完了していない**

### Codex監査（d614ede対象）の主なFAIL理由（指摘6件）
1. GitHub Search APIの不完全・矛盾した応答（`total_count`不正、ページ間不整合、重複Issue番号等）を「既存Issueなし」と扱うfail-open
2. Supabase更新が0件または複数件でも成功扱いされる可能性（`.update().eq()`だけでは実際に何件更新されたか確認していなかった）
3. `verify-country-sources.ts`のstatus更新が`.eq("url", ...)`（URL条件）で行われており、同一URLを共有する別source・別国の行を意図せず更新する可能性
4. `runExtract()`の既存alive取得（`select("url").eq("status","alive")`）でSupabaseの`error`を確認していなかった
5. Issue作成APIレスポンスのtitleが要求と食い違っていても成功扱いにしていた
6. 文書と実際のcommit状態の不一致

この指摘6件へ対応したのが`66b6e38`（下記「Fail-open経路の是正」節）であり、その後のCodex独立監査で**PASS WITH NOTES**を得た。

## 文書同期・Scripts TypeCheck読み取り専用監査（2026-08-01 6回目）

### 目的
push完了後の実際の状態を運用文書へ反映し、`research-study-abroad.yml`内の古いSendGridコメントを現在の実装へ整合させ、pushのたびに失敗している既存`Scripts TypeCheck`ワークフローの原因を読み取り専用で整理する。機能変更は行っていない。

### SendGridコメント修正
`research-study-abroad.yml`の「SendGrid等の新規シークレットは未設定のため、カスタムメール送信は導入していない」という、現行実装（`Check email configuration`・`Send email via SendGrid`の2ステップが既に存在する）と矛盾する古いコメントを、「SendGrid通知は任意。SENDGRID_API_KEYとNOTIFY_EMAILの両方が設定され、新規Issueが作成された場合のみ送信する」という趣旨へ修正した。コメントのみの変更で、`if:`条件・env・permissions・curl・Issue処理等のロジックは無変更。

### Scripts TypeCheck 読み取り専用監査

**Workflow仕様（`.github/workflows/scripts-typecheck.yml`）**
- trigger: `push`および`pull_request`、いずれも`paths: ["scripts/**/*.ts", "tsconfig.scripts.json"]`に一致した場合のみ（scripts配下のTS変更時、またはtsconfig.scripts.json変更時に限定。全pushで無条件に走るわけではない）
- 実行コマンド: `npx tsc --project tsconfig.scripts.json --noEmit`
- Node: **2つの異なるランタイムを区別する必要がある**。(1) GitHub Actionsが各Action（`actions/checkout@v4`等）本体を実行する内部ランタイムはNode 24へ強制されている（annotationで確認、Node 20の非推奨化に伴う措置）。(2) 一方、Workflow内の`actions/setup-node@v4`が`node-version: "20"`を指定してセットアップした結果、`npx tsc --project tsconfig.scripts.json --noEmit`コマンド自体は実際には**Node 20.20.2**上で実行されている（run `30691286359`のログで`Acquiring 20.20.2 - x64`を確認）。「TypeScriptはNode 24で実行された」「Workflow指定Node 20がNode 24へ置き換えられた」という理解は誤り。TypeScript: `package.json`の`devDependencies`で`"typescript": "^5"`
- 検査対象: `tsconfig.scripts.json`の`include: ["scripts/**/*.ts"]`により`scripts/`配下の全`.ts`ファイル（サブディレクトリ含む）が対象
- exclude設定: `node_modules`と個別ファイル2件（`scripts/check-th-live.ts`、`scripts/check-th-wayback.ts`）のみ。`_`プレフィックス等のscratch命名規則に基づく除外は存在しない
- pushのたびに実行されるか: **scripts配下のTS変更を伴うpushのみ**（無条件の全push起動ではない）。今回のpush（`66b6e38`まで）はscriptsを変更しているため起動し、失敗した

**正確な失敗原因**
- ローカルで`npx tsc --project tsconfig.scripts.json --noEmit`を実行すると、リポジトリに実在する未追跡scratchスクリプト（本セッションの調査用一時ファイル、約8件）も同時にコンパイル対象へ含まれてしまうため、ローカルの生エラー出力にはCI（GitHub上のコミット済み内容のみ）とは無関係なファイルが混在する。`git ls-files`で個別に追跡状態を確認し、**実際にGitHub側のCI失敗に関与する追跡済みファイルは以下10件**と特定した。ただしこの10件は原因の異なる2種類に分かれる（一律「10件すべてimport/exportなし」「10件すべてグローバルスコープ衝突」ではない）:
  - **9件**（グローバルスコープでの名前衝突が原因）: `scripts/_calc-b1b2b3-correction.ts`・`scripts/_check-b4-sources.ts`・`scripts/_check-hu-cp04.ts`・`scripts/_check-pt-cz-cp041.ts`・`scripts/_check-study-work-urls.ts`・`scripts/_check-tr-mukerrer.ts`・`scripts/_fetch-b4-data.ts`・`scripts/_fetch-eurostat-hbs4.ts`・`scripts/_fetch-eurostat-ses22-v3.ts`
  - **1件**（原因が異なる）: `scripts/_patch-ar-tax-brackets.ts`
- 主なエラーコード（run `30691286359`の実CIログで確認、GitHub上のコミット済み10ファイルのみが対象）: `TS2393`（Duplicate function implementation）25件、`TS2451`（Cannot redeclare block-scoped variable、例: `COUNTRIES`/`PPP`/`NACE_TARGET`等）7件、`TS1501`（正規表現フラグがes2018未満のtargetで使用不可、`_patch-ar-tax-brackets.ts`のみ）3件。その他付随エラーとして`_fetch-eurostat-hbs4.ts`の`TS2339`（`Number`型に存在しないプロパティ参照）2件を実CIログで確認
- `TS2300`（Duplicate identifier、例: `NaceKey`）について: **run `30691286359`のGitHub Actions実CIログでは0件**。ローカル環境で未追跡の`scripts/_fetch-b3-data.ts`（`_fetch-b4-data.ts`と同名の型`NaceKey`を独立に定義）を含めて`npx tsc`を実行した場合にのみ、この2ファイル間の衝突として`TS2300`が発生する。`_fetch-b3-data.ts`はGitHubへpushされていないためCIには存在せず、`_fetch-b4-data.ts`単独では衝突相手がなく`TS2300`は発生しない（`_fetch-b4-data.ts`の実CIエラーは`TS2393`4件・`TS2451`2件のみ）。したがって追跡済み10ファイルによるCI失敗原因には`TS2300`を含めない。**追跡済みファイルだけのCI結果と、未追跡ファイルを含むローカル検査結果を混同しないこと**
- `Duplicate function implementation`が発生する構造（**上記9件が対象。10件全部ではない**）: この9件はいずれも先頭で`import`/`export`文を一切使用しておらず（`grep -c "^import \|^export "`で0件を確認）、TypeScriptはimport/exportのないファイルを「モジュール」ではなく「スクリプト」として扱い、トップレベル宣言をグローバルスコープへ展開する。`tsconfig.scripts.json`の`include`が`scripts/**/*.ts`全体を1つのコンパイル単位として扱うため、複数の一時調査ファイルが同名の`COUNTRIES`・`PPP`等の変数やヘルパー関数を独立に定義していると、同一グローバルスコープ内での再宣言としてエラーになる（対照として、`generate-country-article.ts`等の正式運用スクリプトは全てimport文を持ち、モジュールとして分離されている）。**残り1件`scripts/_patch-ar-tax-brackets.ts`はimport文を2行持つ独立したモジュールであり、このグローバルスコープ衝突の説明には該当しない**
- 各ファイルのGit追跡状態: 上記10件はすべて`git ls-files`で追跡済み（committed）と確認。一方、ローカルのみに存在する同種の未追跡ファイル（`_fetch-b3-data.ts`等8件）はGitHub側のCIには影響しない
- 正式運用scriptからの参照有無: リポジトリ内を検索した結果、対象10ファイルは`package.json`、Workflow、正式スクリプトから直接参照・実行・importされていない
- npm scriptやWorkflowからの直接実行: `package.json`の`scripts`セクション、`.github/workflows/`配下いずれにもこれら10ファイルへの直接参照なし
- 削除時の実運用影響: 上記の通りどこからも参照・実行されていないため、削除しても実運用パイプラインへの影響はないと判断される（ただし今回は削除等の変更は一切行っていない）

**既存運用ルールとの関係**
- `.gitignore`には`/scripts/_tmp-*.ts`と`/scripts/_tmp_*.ts`の2パターンのみ登録されており、広範な`_*.ts`パターンは存在しない
- `.gitignore`はあくまで「今後の新規追跡」を防ぐ設定であり、**既に追跡済み（committed）のファイルには一切効果がない**ことを確認（`git ls-files`で実際に100件超の`scripts/_*.ts`が追跡済みであることからも裏付けられる）
- `tsconfig.scripts.json`の`include`は追跡済みscratchスクリプトも区別なく含んでいる
- 命名規則としては「`_`プレフィックス＝一時調査／scratch」という運用上の慣習が一貫して存在する（`scripts/utils/`配下の正式ユーティリティ含め、production系スクリプトに`_`プレフィックスの例は皆無）ものの、これを**機械的に強制する仕組み（tsconfig除外・lintルール等）は現状存在しない**

### 修正案の比較（今回は未実施）

**案A: tsconfigからscratch scriptを除外**
- `tsconfig.scripts.json`の`exclude`へ`"scripts/_*.ts"`を追加する想定（既存の`_tmp-*`/`_tmp_*`パターンと同じ考え方の拡張）
- 現在の命名規則（`_`プレフィックス=scratch）と完全に一致することを確認済み。正式スクリプトはすべて非`_`プレフィックスのため誤除外なし
- 変更は1ファイル1行のみで最小
- scratch script自体はリポジトリ・commit履歴に残ったまま、型検査の対象からのみ外れる

**案B: 追跡済みscratch scriptをGit管理から外す（`git rm --cached`等）**
- commit履歴には残るが、将来のcloneやチェックアウトでは見えなくなる。100件超のファイルを個別に「本当に将来参照不要か」判断する必要があり、判別コストが高い
- `.gitignore`との整合も別途必要（外した後に再度誤って追跡されないようパターン追加が必要）
- 他スクリプトからの参照は今回の10件・および確認した範囲では無しと分かっているが、全件の悉皆確認はしていない

**案C: 各scratch scriptの型エラーを個別修正**
- 対象10件それぞれの重複名を解消する作業量が発生し、かつ将来同様の一時ファイルが追加されれば同じ問題が再発する（構造的な再発防止にならない）
- 一時調査コード（既に用途を終えたもの）に保守コストを掛ける価値は低く、production scriptの品質向上にも寄与しない

**案D: TypeCheckを正式script専用構成へ分離（allowlist化・ディレクトリ再編等）**
- 長期的な保守性は高いが、100件超のファイル移動・パス参照更新を伴う可能性があり移行コストが大きい
- 現状は`_`プレフィックスという一貫した命名規則が既に存在するため、案Aで同等の効果を最小コストで得られる。現時点では過剰設計と判断

### PM向け推奨案
- **推奨: 案A**（`tsconfig.scripts.json`の`exclude`へ`"scripts/_*.ts"`を追加）
- 推奨理由: 既存の命名規則（`_`プレフィックス=scratch）とすでに一致しており、正式スクリプトを誤って除外するリスクがない。1行の変更で完結し、scratchスクリプト自体はリポジトリに残せる（削除・移動を伴わない）。案Bのような個別要否判断や案Dのようなディレクトリ再編を要しない
- 変更対象ファイル: `tsconfig.scripts.json`（1ファイルのみ）
- 除外候補ファイル: `scripts/_*.ts`（直下のみ、サブディレクトリに`_`プレフィックスファイルは現状存在しないことを確認済み）
- 除外してはいけない正式script: `scripts/`直下の非`_`プレフィックス全ファイル、および`scripts/utils/`配下の全ファイル（`db-update.ts`・`github-issue-dedup.ts`等）。念のため`exclude`追加後に`git ls-files scripts/*.ts scripts/**/*.ts`と`tsc`の実際の検査対象リストを突き合わせ、正式スクリプトが1件も減っていないことを確認する想定
- 想定される副作用: scratchスクリプトの型エラーが二度と検出されなくなる（意図通り）。将来`_`プレフィックスを使わない新しい一時ファイルを作った場合はこの除外の対象外になる点は運用上の注意点として残る
- Codex監査で確認すべき点: 除外パターンが正式スクリプトを1件も巻き込んでいないか、`_tmp-*`/`_tmp_*`との重複定義にならないか、既存の`check-th-live.ts`等の個別exclude行との整合
- 修正後の検証方法: `npx tsc --project tsconfig.scripts.json --noEmit`がエラー0件で完走すること、`git ls-files scripts/*.ts`のうち非`_`プレフィックスファイル数と実際に型検査された件数が一致すること（除外されすぎていないか）

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
- Issue #1／#2の整理・close判断は、本タスクの範囲外として保留（ユーザー判断が必要）。＊2026-08-01訂正＊: この時点では「旧版run」とだけ記していたが、実際にはhead SHA `7ae0466`で実行された旧集約通知実装の週次run（`30683910156`）・月次run（`30685732548`）が原因と特定済み（詳細は本ファイル上部参照）
- ＊2026-08-01追記＊: このcommitを含む一連の修正は`66b6e38`まで進んだ後、2026-08-01にpush済み。ただし本箇条書き自体はpush前時点の記録であり、実スケジュール実行によるend-to-end確認はこの記述時点・現時点ともに未完了

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
- Issue #1／#2の整理・close判断は、本タスクの範囲外として保留（ユーザー判断が必要）。＊2026-08-01訂正＊: 実際にはhead SHA `7ae0466`で実行された旧集約通知実装（`if: failure()`ベース）の週次run（`30683910156`）・月次run（`30685732548`）が原因と特定済み（詳細は本ファイル上部参照）
- ＊2026-08-01追記＊: このcommitを含む一連の修正は`66b6e38`まで進んだ後、2026-08-01にpush済み。ただし本箇条書き自体はpush前時点の記録であり、実スケジュール実行によるend-to-end確認はこの記述時点・現時点ともに未完了

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
- ＊2026-08-01追記＊: このcommitを含む一連の修正は`66b6e38`まで進んだ後、2026-08-01にpush済み。ただし本箇条書き自体はpush前時点の記録であり、実スケジュール実行によるend-to-end確認はこの記述時点・現時点ともに未完了

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
- ＊2026-08-01追記＊: このcommitを含む一連の修正は`66b6e38`まで進んだ後、2026-08-01にpush済み

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
