# Current Handoff

最終更新: 2026-08-01
最終担当: Claude Code
タスクID: HARDEN-GHA-ISSUE-NOTIFICATIONS-20260801
状態: 修正・静的検証完了。commit予定（push未実施）。Codex監査（FAIL）指摘6件への対応完了、実行確認は未完了

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
