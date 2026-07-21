# Recent AI Activity

保持期間: 直近3日間
最終整理: 2026-07-21

---

## 2026-07-22 — Codex

- タスクID: BL-20260721-01（CH FSO LSE 2024 NOGAセクション値補完）
- 状態: 実装・DB反映・検証・commit完了、push待ち
- `industry-salaries.ts`: FSO LSE 2024公式XLSXのNOGAセクション別中央値月額×12からCH 8業種を更新。infrastructure 106,000 CHFは不変
- `country_sources`: FSO公式XLSX直リンク1件をCH/salary/manual/aliveとして登録し、再読込一致を確認
- `simulator_personas`: 事前147件・重複0件・欠落0件を確認後、147件DELETE→147件re-seed、SKIP 0件
- 事後監査: 147/147件、CH 3件、重複0件、欠落0件、現行preset・給与定義との不一致0件
- CH 9業種の静的assert、対象ファイルのESLint、対象スクリプト型チェック、`git diff --check`通過
- 指定5ファイルを`feat(c5): update CH salary data from FSO LSE 2024 official XLSX`でcommit、push未実行

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
