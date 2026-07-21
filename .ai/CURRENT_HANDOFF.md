# Current Handoff

最終更新: 2026-07-22
最終担当: Codex
タスクID: BL-20260721-01（US生活費・JP賞与補完）
状態: 実装・DB反映・検証・commit完了、push待ち

## 目的

C-5の追加調査で承認されたUS生活費とJP賞与込み年収をpresetへ反映する。AU生活費は値を維持し、取得不可理由を最新の調査結果へ更新する。反映後、`simulator_personas`を全件DELETE→re-seedし、presetとの不一致・重複がないことを確認する。

## 現在の状態

- 承認済みのソース変更、DB再seed、全147件の再読込監査まで完了
- 指定5ファイルのチェックポイントcommitを作成済み、pushは未実行
- 次の担当はHEADと対象外差分を確認し、ユーザーの明示許可後にpushする

## 完了した作業

- US `referenceLivingCost`: 1,500→3,700 USD。BLS CE PUMD 2024、CP041+CP042除外、OECD修正等価スケール（AE=1.6445）の条件をコメントへ記録
- AU `referenceLivingCost`: 1,200 AUDを維持。HES等価係数がBasic CURF限定のため取得不可とコメントを更新
- JP 9業種: 所定内給与額×12＋年間賞与その他特別給与額へ更新。月額2023年6月・賞与2022年暦年の時点差を記録
- `simulator_personas`: 147件DELETE→147件re-seed、SKIP 0件
- `docs/BACKLOG.md`: US生活費とJP賞与の完了状態へ記録を整合

## 変更した主要ファイル

- `src/data/country-presets.ts`
- `src/data/industry-salaries.ts`
- `docs/BACKLOG.md`
- `.ai/CURRENT_HANDOFF.md`
- `.ai/RECENT_ACTIVITY.md`
- DB: `simulator_personas`

## Git状態・未コミット変更

- HEAD / origin/main: `1a8707c`
- 今回の未コミット差分: 上記Markdown 3ファイルとデータ2ファイル
- 開始時からの既存差分: `tsconfig.scripts.tsbuildinfo`、`tsconfig.tsbuildinfo`（今回対象外・変更を保持）
- 開始時からの既存未追跡スクリプト・一時ファイルは変更・削除していない

## 実行済みの検証

1. US 3,700、AU 1,200、JP 9業種の静的assert: 完全一致
2. 対象2ファイルのESLint: 通過
3. DB事前監査: 147件、重複0件
4. DB再seed: 147件DELETE→147件INSERT、SKIP 0件、付属汚染チェック0件
5. DB再読込直接監査: 147/147件、ユニークキー147件、重複0件、欠落0件、現行preset・給与定義との不一致0件
6. US再読込: 単身3,700、共働き3,700、管理職夫婦4,810（既存1.3倍ルール）
7. `git diff --check`: 通過

## 未実行の検証

- Next.js全体のbuild（データ定義とDB seedのみのため未実行）
- 全scripts型チェック（多数の既存未追跡スクリプトを含むため未実行）

## 未解決事項

- 既存の`scripts/_audit-persona-rates.ts`は手書きの`CURRENT_RATES`が現行presetと同期しておらず、18件を誤検出する。今回のDB監査は実際の`countryPresets`をimportして代替済み

## 次に行う作業

1. HEADと対象外差分が保持されていることを確認
2. pushは別途明示許可後に実行

## 禁止事項・注意事項

- 記事生成・公開・force-regenerateを実行しない
- 既存差分・未追跡ファイルを変更・commitしない
- pushは明示許可なしに実行しない

## ユーザー判断が必要な事項

- commitのpush許可
