# Current Handoff

最終更新: 2026-07-21（push完了）
最終担当: Claude Code
タスクID: AI-WORKFLOW-APPLY-20260721
状態: 完了・push済み

## 目的

moveworth-ai-workflow-final-reviewed パッケージを実リポジトリへ適用し、
AI開発・引き継ぎ運用体制（CLAUDE.md / AGENTS.md / .ai/ / docs/BACKLOG.md 等）を確立する。

## 現在の状態

- パッケージ適用: 完了（commit は次セッションの指示により push 保留）
- C-5 Group B GB/JP: 完了（commit fcd4189）
- C-5 Group B 残り6カ国（CA/AU/CH/NZ/KR/US）: 次回セッション

## 完了した作業

### C-5 Group B GB/JP（fcd4189）
- industry-salaries.ts GB: ONS ASHE 2023 Table 16.7a 中央値年収 9業種
- industry-salaries.ts JP: MHLW 賃金構造基本統計 令和5年 月額×12（賞与除く）9業種
- country-presets.ts GB: referenceLivingCost £1,000→£1,400（ONS LCF FYE2023）
- country-presets.ts JP: referenceLivingCost 現行値維持（家計調査取得不可コメント追加）
- country_sources: gb/salary, gb/living_cost, jp/salary 登録
- simulator_personas: 147件 DELETE→re-seed→汚染0件

### 運用ファイルパッケージ適用（本タスク）
- CLAUDE.md: 旧版 → 最終版（force-regenerate毎回承認制・salary/living_cost purpose追加等）
- 01_要件定義書_仕様書.md / 02_設計書.md: 初期文書注意書きヘッダー追加版に更新
- AGENTS.md: 新規作成（Codex 入口ファイル）
- docs/AI_WORKFLOW.md: 新規作成（Claude/Codex共通作業記録仕様）
- docs/BACKLOG.md: 新規作成（BL-20260721-01〜08）
- .ai/DECISIONS.md: 新規作成（DEC-20260721-01〜08）
- .ai/RECENT_ACTIVITY.md: 新規作成
- .ai/archive/CHAT_HANDOVER_2026-03.md: 旧 CHAT_HANDOVER.md をアーカイブ移行
- CHAT_HANDOVER.md: 削除（アーカイブ移行後）

## 変更した主要ファイル

- CLAUDE.md（上書き）
- 01_要件定義書_仕様書.md（上書き）
- 02_設計書.md（上書き）
- AGENTS.md（新規）
- docs/AI_WORKFLOW.md（新規）
- docs/BACKLOG.md（新規）
- .ai/CURRENT_HANDOFF.md（新規）
- .ai/RECENT_ACTIVITY.md（新規）
- .ai/DECISIONS.md（新規）
- .ai/archive/CHAT_HANDOVER_2026-03.md（新規）
- CHAT_HANDOVER.md（削除）
- src/data/industry-salaries.ts（GB/JP 9業種更新）
- src/data/country-presets.ts（GB livingCost更新+JP/GBコメント追加）
- scripts/_seed-gb-jp-stats-sources.ts（新規）

## Git状態・未コミット変更

- fcd4189: feat(c5): GB/JP 業種別年収・GB referenceLivingCost を実測値に更新 → push 済み
- a177deb: chore(docs): AI開発・引き継ぎ運用ファイル一式を適用 → push 済み

## 実行済みの検証

- 事前チェック5項目: 全クリア
- CHAT_HANDOVER.md とアーカイブ版の内容照合: 一致（ヘッダー追加以外）
- simulator_personas: 147件 re-seed、汚染0件
- country_sources: 3件登録成功

## 未実行の検証

- git diff --check（trailing whitespace 等）
- 適用後 Markdown リンク検証（新ファイル群の参照パス）
- scripts typecheck（今回変更はすべて .md、影響なし）

## 未解決事項

- C-5 Group B 残り6カ国（CA/AU/CH/NZ/KR/US）の実データ取得
  - KR: SSO認証でスクリプト取得困難
  - US: BLS統計局 403 問題
- GB referenceRent: ONS PRMS 未調査（BL-20260721-08）

## 次に行う作業

1. C-5 Group B 残り6カ国の実データ取得（次回セッション）
   - CA: Statistics Canada / ABS AUS / SNF CH / Stats NZ / KOSTAT KR / BLS US
2. KR/US の別ルート調査（SSO認証 / 403 回避）

## 禁止事項・注意事項

- force-regenerate は実行のたびにユーザーの明示的許可を得る。包括許可は不可
- 保護対象記事（saily / nordvpn）のアフィリエイトリンク・料金・URLパラメータは変更禁止
- push はユーザーの明示的許可後のみ

## ユーザー判断が必要な事項

- C-5 Group B 残り6カ国の作業開始時期
