# Current Handoff

最終更新: 2026-07-22
最終担当: Codex
タスクID: BL-20260721-08（GB referenceRent — ONS PRMS反映）
状態: 実装・DB反映・検証・commit完了、push待ち

## 目的

ONS PRMS最終公表（2022年10月～2023年9月）のEngland全域・全物件タイプ月額中央値£850をGB `referenceRent`へ反映する。公式URLを`country_sources`へ`purpose=living_cost`で登録し、`simulator_personas`を全件DELETE→re-seedして汚染がないことを確認する。

## 現在の状態

- コード・記録・DB反映と検証が完了
- 指定5ファイルをチェックポイントcommitへ含め、pushはユーザーの明示許可待ち

## 完了した作業

- `country-presets.ts`: GB `referenceRent`を£1,500→£850へ更新
- ONS PRMSの対象期間、England全域・全物件タイプ中央値、最終公表・廃止済み、UK全体ではない条件をコメントへ記録
- `scripts/_seed-gb-jp-stats-sources.ts`: ONS PRMS URLを追加し、`gb-prms`指定で対象1件だけをupsert・再読込検証できるように更新
- `country_sources`: ONS PRMS公式ページをGB/living_cost/manual/aliveとして1件登録し、再読込一致
- `simulator_personas`: 事前147件を全件DELETEし、現行presetから147件re-seed、SKIP 0件
- `docs/BACKLOG.md`: BL-20260721-08を完了へ更新

## 変更した主要ファイル

- `src/data/country-presets.ts`
- `scripts/_seed-gb-jp-stats-sources.ts`
- `docs/BACKLOG.md`
- `.ai/CURRENT_HANDOFF.md`
- `.ai/RECENT_ACTIVITY.md`
- DB: `country_sources` 1件追加、`simulator_personas` 147件再作成

## Git状態・未コミット変更

- HEAD / origin/main: `eb6ca82`
- 今回の未コミット差分: 上記5ファイル
- 開始前からの既存差分: `tsconfig.scripts.tsbuildinfo`、`tsconfig.tsbuildinfo`（今回対象外・保持）
- 開始前からの未追跡調査スクリプト・一時ファイルは変更・削除していない

## 実行済みの検証

1. GB静的assert: `referenceRent=850`、`referenceLivingCost=1400`不変
2. 対象コード・一時監査スクリプトのESLint: 通過
3. 対象ソース登録・監査スクリプトの専用TypeScript型チェック: 通過
4. DB事前監査: 147件、重複0件、欠落0件。GBの旧`rentTarget`不一致のみ3件
5. `country_sources`: 対象URL 0→1件、保存フィールド完全一致
6. DB再seed: 147件DELETE→147件INSERT、SKIP 0件、付属汚染チェック0件
7. DB事後監査: 147/147件、GB 3件、重複0件、欠落0件、現行preset・給与定義との不一致0件
8. `git diff --check`: 通過

## 未実行の検証

- Next.js全体build（データ定義・DB seed・記録変更のみのため未実行）
- 全scripts型チェック（多数の既存未追跡スクリプトを含むため未実行。今回対象は専用設定で通過）

## 未解決事項

- 今回タスクはなし
- 既存BL-20260722-01: 検証スクリプト2本のDE 35%ハードコード修正

## 次に行う作業

1. commitのHEADと対象外差分が保持されていることを確認
2. pushは別途明示許可後に実行

## 禁止事項・注意事項

- PRMS値をUK全体値と表現しない
- 既存のビルド情報差分・未追跡ファイルを変更・commitしない
- 記事生成・公開・force-regenerateは行わない
- pushは明示許可なしに行わない

## ユーザー判断が必要な事項

- commitのpush許可
