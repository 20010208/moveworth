# Recent AI Activity

保持期間: 直近3日間
最終整理: 2026-07-21

---

## 2026-07-22 — Claude Code

- タスクID: PUBLISH-SUIKA-VPN-ARTICLE-20260722
- 状態: 公開・検証・commit完了、push待ち
- `suika-vpn-overseas-japanese-streaming-guide-2026`を公開（`is_published`のみをターゲットパッチでtrueへ切り替え、再生成なし）
- 公開前後でcontent・titleの不変を機械比較、対象外blog_posts 96件のbefore/afterスナップショット完全一致（0件変化）を確認
- `check-published-slugs-http.ts`: 公開94件全てHTTP 200（suika-vpn含む）
- `inspect-all-blog-posts.ts`: 97件（公開94・非公開3）構造不正0件
- 指定3ファイルを`feat: publish suika-vpn affiliate article`でcommit、push待ち
- URL: https://www.moveworthapp.com/blog/suika-vpn-overseas-japanese-streaming-guide-2026

---

## 2026-07-22 — Claude Code

- タスクID: UPDATE-SUIKA-VPN-CONTENT-20260722
- 状態: content更新・検証・commit完了、push待ち
- `suika-vpn-overseas-japanese-streaming-guide-2026`のcontent.ja/en/zhを、料金表・クーポン実質月額・接続速度データ・画像3枚を反映した内容へ更新（`is_published`は変更せずfalseを維持）
- 画像3枚（features/pricing/speed-comparison）をsharpで圧縮（70〜78%削減）後、`blog-images/Suika/`へアップロード
- 発見・修正: 初回投稿時のアフィリエイトリンクが素の`<a>`タグのままで、フロント`renderContent`の`<!-- html -->`ラップ規約に沿っておらずクリック不可の文字列表示になっていた不具合。href・視認テキストの実体は変更せず、htmlマーカーのみ追加して修正（表示テキストは今回のユーザー提供本文に合わせ「はこちら」付きに変更、ユーザー承認済み）
- `assertBlogPayload`通過、アフィリエイトhref出現回数（ja/en/zh各2回）確認、禁止パターン0件、必須文字列（クーポン3種・料金4種・画像URL3種）確認
- DB更新前後で`is_published`含む保護対象フィールドの不変を機械比較 → 一致
- `inspect-all-blog-posts.ts`: blog_posts 97件（公開93・非公開4）構造不正0件、study側異常0件
- 指定3ファイルを`feat: update suika-vpn article with images, pricing table and fix affiliate link rendering`でcommit、push未実行
- 次: pushはユーザー明示許可後、公開はKoki側判断

---

## 2026-07-22 — Claude Code

- タスクID: ADD-SUIKA-VPN-ARTICLE-20260722
- 状態: draft投稿・検証完了、commit実施（push未実行）
- 新規アフィリエイト記事 `suika-vpn-overseas-japanese-streaming-guide-2026`（category: money, JA/EN/ZH）を`blog_posts`へ`is_published: false`でinsert
- `assertBlogPayload`通過、アフィリエイトリンク`<a href="https://www.suika-v2.com/?im=tu6">...`をja/en/zh各2箇所で完全一致確認、example.com・GPT拒否パターン0件
- `inspect-all-blog-posts.ts`: blog_posts 97件（公開93・非公開4）構造不正0件、study側も異常0件
- 料金確認のため`suika-v2.com`・`vpn.co.jp`をWebFetchで調査。`vpn.co.jp`は第三者VPN比較ポータル（一次情報でない）と判明し、価格の断片も相互不整合のため「確認不可」と判断。ユーザー承認を得てJA本文は料金なしで確定
- `CLAUDE.md`セクション7のPROTECTED_SLUGSへ本スラグを追加
- 指定4ファイルを`feat: add suika-vpn affiliate article draft and protect slug`でcommit予定、push未実行
- 次: EN/ZH本文のユーザーレビュー、承認後の公開判断

---

## 2026-07-22 — Codex

- タスクID: BL-20260721-06（study側の機械検証基盤強化・優先2点）
- 状態: 部分対応・DB反映・検証・commit完了、push待ち
- `inspect-all-blog-posts.ts`: studyのZH欠落・example.com・GPT拒否検出とstudy取得失敗を終了コードへ反映
- `visa-bg`: content.ja/en/zh、`visa-cy`: content.zhに、登録済み政府公式visaソースから参考資料セクションを対象限定で補完。`force-regenerate`不使用、公開状態trueを維持
- DB再読込: 対象2件の計画値一致、対象外94件不変、対象外言語・title・description・公開状態不変、`assertBlogPayload` 2/2件通過
- 横断再検証: blog 96件の構造不正0件、公開visa 51件の参考資料セクション数正常、study 113件の対象検査異常0件、exit 0
- `docs/BACKLOG.md`: BL-20260721-06を「部分対応・継続中」へ更新。構造・URL重複・生URL・参照ラベル等は継続
- 指定5ファイルを`fix: reflect study errors in exit code and patch visa-bg/cy reference sections`でcommit、push未実行

---

## 2026-07-22 — Codex

- タスクID: BL-20260722-01（検証スクリプトのDE税率ハードコード修正）
- 状態: 実装・検証・commit・push完了
- 対象2スクリプトの全国家preset税率ハードコードを削除し、`countryPresets`直接参照へ統一。DEは0.39として動的解決
- `validate-simulator-blog.ts`: 旧インラインpresetを削除し、全50カ国の税率・家賃・生活費・通貨を正本から参照
- `_audit-persona-rates.ts`: 手動税率Mapを動的生成へ変更し、強制終了によるWindows libuv assertionも解消
- 静的assert、対象ESLint、対象限定型チェック、両スクリプト実行に成功。ペルソナ147件・重複0件・税率乖離0件
- `docs/BACKLOG.md`: BL-20260722-01を完了。別の`TO_JPY`同期漏れをBL-20260722-02へ記録
- 指定5ファイルを`fix: replace hardcoded DE tax rate with dynamic preset reference`でcommit（`335ca4b`）、origin/mainへpush済み

---

## 2026-07-22 — Codex

- タスクID: BL-20260721-02（BG / CY一次情報URLの再調査・登録）
- 状態: 実装・DB反映・検証・commit・push完了
- BGは政府行政登録IISDAのVisa D・非EU市民継続滞在許可、CYは新`gov.cy`のvisa・entry/residence・visitor・immigration permitページを採用
- `country_sources`: 事前0件からBG 2件・CY 4件をvisa/alive/manualで登録し、DB再読込6/6件一致
- 既存BG/CY対象外12件の前後完全一致、BG/CY総件数12→18件を確認
- `scripts/_seed-bg-cy-visa-sources.ts`を新規作成し、対象限定upsert・再読込・対象外不変検証を実装
- `docs/BACKLOG.md`: BL-20260721-02を完了へ更新
- 対象スクリプトのESLint・単体TypeScript型チェック・`git diff --check`通過。指定4ファイルを`feat: add BG/CY visa source URLs and close BL-02`でcommit（`8fb1c8f`）、origin/mainへpush済み

---

## 2026-07-22 — Codex

- タスクID: BL-20260721-08（GB referenceRent — ONS PRMS反映）
- 状態: 実装・DB反映・検証・commit・push完了
- `country-presets.ts`: GB `referenceRent`を£1,500→£850へ更新。ONS PRMS最終公表のEngland全域・全物件タイプ中央値でありUK全体ではないことをコメントへ記録
- `country_sources`: ONS PRMS公式ページ1件をGB/living_cost/manual/aliveとして登録し、再読込一致を確認
- `simulator_personas`: 事前147件・重複0件・欠落0件を確認後、147件DELETE→147件re-seed、SKIP 0件
- 事後監査: 147/147件、GB 3件、重複0件、欠落0件、現行preset・給与定義との不一致0件
- GB値の静的assert、対象ファイルのESLint、対象スクリプト型チェック、`git diff --check`通過
- 指定5ファイルを`feat(c5): update GB referenceRent from ONS PRMS and close BL-08`でcommit（`6af6cc2`）、origin/mainへpush済み

---

## 2026-07-22 — Codex

- タスクID: BL-20260721-07（DE defaultTaxRate差分の再確認）
- 状態: 実装・検証・commit・push完了
- `country-presets.ts`: DE 39%は実効39.4%の丸め値で差分0.4ptが閾値内であること、Bundeszentralamt für Steuernをnotesへ3言語で記録。数値は不変
- `docs/BACKLOG.md`: BL-20260721-07を完了へ更新
- 検証スクリプト2本のDE 35%ハードコード問題をBL-20260722-01として登録
- 対象ファイルのESLint、静的assert、`git diff --check`通過
- 指定メッセージ`chore: add DE tax rate source comment and close BL-07`でcommit（`eb6ca82`）、origin/mainへpush済み

---

## 2026-07-22 — Codex

- タスクID: BL-20260721-01（CH FSO LSE 2024 NOGAセクション値補完）
- 状態: 実装・DB反映・検証・commit・push完了
- `industry-salaries.ts`: FSO LSE 2024公式XLSXのNOGAセクション別中央値月額×12からCH 8業種を更新。infrastructure 106,000 CHFは不変
- `country_sources`: FSO公式XLSX直リンク1件をCH/salary/manual/aliveとして登録し、再読込一致を確認
- `simulator_personas`: 事前147件・重複0件・欠落0件を確認後、147件DELETE→147件re-seed、SKIP 0件
- 事後監査: 147/147件、CH 3件、重複0件、欠落0件、現行preset・給与定義との不一致0件
- CH 9業種の静的assert、対象ファイルのESLint、対象スクリプト型チェック、`git diff --check`通過
- 指定5ファイルを`feat(c5): update CH salary data from FSO LSE 2024 official XLSX`でcommit（`813cd2f`）、origin/mainへpush済み

---

## 2026-07-21 — Codex

- タスクID: BL-20260721-01（US生活費・JP賞与補完）
- 状態: 実装・DB反映・検証・commit完了、push待ち
- `country-presets.ts`: US生活費を1,500→3,700 USDへ更新。AUは1,200 AUDを維持し、Basic CURF限定による取得不可コメントへ更新
- `industry-salaries.ts`: JP 9業種を所定内給与額×12＋年間賞与その他特別給与額へ更新し、月額・賞与の時点差を記録
- `simulator_personas`: 事前147件・重複0件を確認後、147件DELETE→147件re-seed、SKIP 0件
- 再読込監査: 147/147件、重複0件、欠落0件、給与・生活費・家賃・税率・物価・通貨のpreset不一致0件
- 承認値の静的assert、対象2ファイルのESLint、`git diff --check`通過
- 既存の`_audit-persona-rates.ts`は手書き税率表が現行presetと不一致で誤検出するため、実定義との直接比較を使用
- 指定5ファイルを`feat(c5): update US living cost and JP salary with bonus from official sources`でcommit、push未実行

---

## 2026-07-21 — Codex

- タスクID: BL-20260721-01（C-5 Group B NZ/KR/US）
- 状態: 実装・DB反映・検証・commit完了、push待ち
- `industry-salaries.ts`: Stats NZ QES 2026年3月、雇用労働部2025年6月、BLS OEWS May 2025からNZ/KR/US各9業種を更新
- `country-presets.ts`: NZ/KR/US生活費は現行値を維持し、取得不可・未実施理由をコメントへ記録
- `country_sources`: Stats NZ QES / 雇用労働部 / BLS OEWSの給与URL3件を`purpose=salary`でupsertし、再読込一致を確認
- `simulator_personas`: 147件DELETE→147件re-seed、SKIP 0件
- 独立監査: 147/147件、重複キー0件、給与・生活費・家賃・税率・物価・通貨のpreset不一致0件、NZ/KR/US 9/9件
- 承認値27件・生活費3件の静的assert、対象3ファイルのESLint、専用tsconfig型チェック通過
- 指定6ファイルのチェックポイントcommitを作成、push未実行

---

## 2026-07-21 — Codex

- タスクID: BL-20260721-01（C-5 Group B CA/AU/CH）
- 状態: 実装・DB反映・検証・commit完了、push待ち
- `industry-salaries.ts`: CA/AU各9業種を公式2025年値へ更新、CHはFSO LSE 2024で取得可能なinfrastructureのみ106,000 CHFへ更新
- `country-presets.ts`: CA/AU/CH生活費は現行値を維持し、取得不可理由をコメントへ記録
- `country_sources`: StatsCan / ABS EEH / FSO LSEの給与URL3件を`purpose=salary`でupsertし、再読込一致を確認
- `simulator_personas`: 147件DELETE→147件re-seed、独立監査で重複0件・preset不一致0件
- 承認値27件・生活費3件の静的検証、対象限定型チェック、ESLint通過
- 全scripts型チェックは既存・未追跡スクリプトのグローバル重複エラーにより未通過（今回対象2スクリプトは通過）
- 指定6ファイルのチェックポイントcommitを作成、push未実行

---

## 2026-07-21 — Codex

- タスクID: BL-20260721-03
- 状態: 完了・commit済み・push待ち
- study_blog_posts全113件を監査し、完全ZH 112件を確認
- ユーザー承認値でstudy-country-trのtitle.zh / description.zhのみを対象限定更新
- 更新前後の全113件比較でcontent.zh 1127字とis_published=trueが不変、対象外112件の変更0件を確認
- DB再読込で承認値の完全一致とassertBlogPayload相当の検証通過を確認
- 既存のZHタイトル/description検証とZH本文検証はいずれも113/113件通過

---

## 2026-07-21 — Codex

- タスクID: FIX-TEMP-IGNORE-PATTERN-20260721
- 状態: 完了・commit済み・push待ち
- `.gitignore`の2行目を `/scripts/_tmp_*.ts` へ修正
- `git check-ignore`で未追跡一時スクリプト12本を確認
- 正式スクリプト231本の新規ignoreが0本であることを確認
- 実文字列・UTF-8バイト列・diff checkを確認
- 関連commit: `fix: correct temporary script ignore pattern`

---

## 2026-07-21 — Codex

- タスクID: IGNORE-TEMP-SCRIPTS-PUSH-20260721
- 状態: 完了・push済み
- `.gitignore`へ一時スクリプト用の指定2パターンを追加
- 未追跡一時スクリプト12本へのignore適用とdiff checkを確認
- `89bb7f2` と `chore: ignore temporary scripts` の2 commitsを `origin/main` へpush
- 対象外の `tsconfig*.tsbuildinfo` 2件と未追跡38項目は保持

---

## 2026-07-21 — Codex

- タスクID: DEPENDENCY-RECORD-CLEANUP-20260721
- 状態: 完了・commit済み・push待ち
- `adm-zip` / `xlsx` のmanifest・lockfile差分をコミット対象として整理
- `a177deb` のpush状態表記を「push済み」へ修正
- 2依存のインストール状態とlockfile整合、対象4ファイルのdiff checkを確認
- 未追跡50項目は変更せず、`.gitignore`候補のみ整理
- 関連commit: `chore: add adm-zip and xlsx dependencies for GB/JP data parsing`

---

## 2026-07-21 — Claude Code

- タスクID: C5-GROUP-B-GB-JP-20260721 / AI-WORKFLOW-APPLY-20260721
- 状態: 完了

### 実施内容

**C-5 Group B GB/JP（commit fcd4189）**
- ONS ASHE 2023 Table 16.7a スクリプト取得・パース完了（9業種中央値年収）
- ONS LCF FYE2023 スクリプト取得・パース完了（実家賃シェア 10.04%）
- MHLW 賃金構造基本統計 令和5年 第５－１表 スクリプト取得・パース完了（9業種月額×12）
- DEC-20260721-08 エクスパット推計値不使用原則を JP にも適用
- country-presets.ts GB: referenceLivingCost £1,000→£1,400（ONS LCF FYE2023, AE=1.58）
- country_sources: gb/salary, gb/living_cost, jp/salary 3件登録
- simulator_personas: 147件 DELETE→re-seed→汚染0件 ✅

**運用ファイルパッケージ適用（本タスク）**
- CLAUDE.md / AGENTS.md / docs/AI_WORKFLOW.md / docs/BACKLOG.md / .ai/* を新規導入
- CHAT_HANDOVER.md をアーカイブ（.ai/archive/CHAT_HANDOVER_2026-03.md）後に削除
- docs/BACKLOG.md: BL-20260721-01 を GB/JP 完了・CA/AU/CH/NZ/KR/US 次回へ更新
- BL-20260721-08（GB referenceRent ONS PRMS）を新規追加

### 検証結果

- 事前チェック5項目: 全クリア
- simulator_personas 汚染: 0件 ✅
- CHAT_HANDOVER.md 照合: アーカイブ版と内容一致 ✅

### 未解決

- C-5 Group B 残り6カ国（CA/AU/CH/NZ/KR/US）: 次回セッション
- KR: SSO認証、US: BLS 403 問題が残る

### 次の担当・次の作業

Claude Code（次回セッション）: C-5 Group B CA/AU/CH/NZ/KR/US

### 関連コミット

- fcd4189: feat(c5): GB/JP 業種別年収・GB referenceLivingCost を実測値に更新
- a177deb: chore(docs): AI開発・引き継ぎ運用ファイル一式を適用（push済み）

---

## 2026-07-21 — ChatGPT

- タスクID: AI-WORKFLOW-20260721-REVIEW
- 状態: 完了・実リポジトリ適用済み

### 実施内容

- Claude / Sonnetレビュー結果の必須修正1〜6を反映
- C-5 Group B GB / JPの取得ブロッカーをbacklog・handoffへ反映（現在は解消済み）
- DEC-20260721-08として C-5 grounding方法論を追加
- nordvpn / saily保護ルールを実態に合わせて更新
- push運用を明示許可制として正式採用（DEC-20260721-07）
- force-regenerateを毎回の都度承認制に統一

### 未解決（適用時に解消済み）

- docs/redirect-backlog.mdとの重複確認 → 重複なし（別目的）
- 旧CHAT_HANDOVER.md → アーカイブ後削除済み
