# Current Handoff

最終更新: 2026-07-21
最終担当: Codex
タスクID: BL-20260721-01
状態: NZ/KR/US 実装・DB反映・検証・commit完了、push待ち

## 目的

C-5 Group Bの残り3カ国（NZ/KR/US）について、承認済みの公式統計ベース業種別年収を反映する。生活費は取得不可方針に従って現行値を維持し、理由をコメントへ記録する。公式統計URLを`country_sources`へ登録し、`simulator_personas`を最新presetから再seedして汚染を検証する。

## 承認済み方針

- NZ: Stats NZ QES 2026年3月四半期、ANZSIC 9業種、平均週給×52を1,000 NZD単位へ丸めた値を反映
- KR: 雇用労働部 2025年6月調査、KSIC 9業種、全労働者の月間総賃金×12を反映
- US: BLS OEWS May 2025、NAICS 9業種、National / All Occupations / Annual mean wageを反映
- NZ生活費: 1,000 NZD維持。CP042相当なしのため取得不可
- KR生活費: 800,000 KRW維持。CP042相当なしのため取得不可
- US生活費: 1,500 USD維持。PUMD集計が必要だが今回は未実施
- 公式給与URL3件を`country_sources`へ登録
- `simulator_personas`は全件DELETE後、最新presetからre-seedし汚染0件を確認

## 今回の変更予定

- `src/data/industry-salaries.ts`
- `src/data/country-presets.ts`
- `scripts/_seed-nz-kr-us-stats-sources.ts`
- `.ai/CURRENT_HANDOFF.md`
- `.ai/RECENT_ACTIVITY.md`
- `docs/BACKLOG.md`
- DB: `country_sources` 3件upsert、`simulator_personas`全件DELETE→re-seed

## 作業開始時のGit状態

- HEAD / origin/main: `6c928b3`
- 既存差分: `tsconfig.scripts.tsbuildinfo`、`tsconfig.tsbuildinfo`
- 既存未追跡ファイル・ディレクトリは変更・削除・commitしない
- 今回対象ファイルに既存差分なし

## 現在の進捗

- NZ/KR/US 27件の公式統計値と現行値比較を提示し、ユーザー承認済み
- 公式URLと取得条件を確認済み
- 給与27件・生活費コメント3件・公式URL登録スクリプトをローカル反映済み
- 承認値27件と生活費3件の静的assert、対象3ファイルのESLint、専用tsconfigでの型チェック通過
- `country_sources`公式給与URL3件をupsertし、DB再読込一致を確認済み
- `simulator_personas`は147件DELETE→147件re-seed、SKIP 0件
- 独立監査で147/147件、重複キー0件、preset不一致0件、NZ/KR/US 9/9件を確認済み

## 実行済みの検証

1. NZ/KR/US 27給与値と生活費3値の静的assert: 完全一致
2. 対象限定TypeScript型チェック: 通過
3. 対象3ファイルのESLint: 通過
4. `country_sources`対象3件のDB再読込: URL・purpose・status・source・検証時刻一致
5. `simulator_personas`: 147件DELETE→147件re-seed、SKIP 0件
6. 独立監査: 147/147件、重複キー0件、給与・生活費・家賃・税率・物価・通貨の不一致0件
7. `git diff --check`: 通過。一時検証ファイル残存なし

## 終了時のGit状態

- 今回のcommit対象: `.ai/CURRENT_HANDOFF.md`、`.ai/RECENT_ACTIVITY.md`、`docs/BACKLOG.md`、`src/data/country-presets.ts`、`src/data/industry-salaries.ts`、`scripts/_seed-nz-kr-us-stats-sources.ts`
- 開始時からの既存差分: `tsconfig.scripts.tsbuildinfo`、`tsconfig.tsbuildinfo`（今回対象外）
- 開始時からの既存未追跡ファイル・ディレクトリは変更・削除していない
- 指定6ファイルのチェックポイントcommitを作成、push未実行

## 禁止事項・注意事項

- 承認済み数値・コメント以外を変更しない
- 記事生成・公開・force-regenerateを実行しない
- pushは次のユーザー指示まで実行しない
- 既存差分・未追跡ファイルを変更しない

## ユーザー判断が必要な事項

- 実装・DB反映・検証完了後、commit対象とメッセージの指示待ち
- pushは明示的なユーザー許可待ち
