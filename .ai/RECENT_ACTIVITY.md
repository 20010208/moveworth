# Recent AI Activity

保持期間: 直近3日間
最終整理: 2026-07-21

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
- a177deb: chore(docs): AI開発・引き継ぎ運用ファイル一式を適用（push 保留）

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
