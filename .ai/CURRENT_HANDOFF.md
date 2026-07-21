# Current Handoff

最終更新: 2026-07-22
最終担当: Codex
タスクID: BL-20260721-02（BG / CY一次情報URLの再調査・登録）
状態: 実装・DB反映・検証・commit完了、push待ち

## 目的

再調査でHTTP 200と本文内容を確認したBG 2件・CY 4件の政府公式ページを`country_sources`へ`purpose=visa`で登録し、DB再読込で6件全件の保存値を検証する。完了後、`docs/BACKLOG.md`のBL-20260721-02を完了へ更新する。

## 現在の状態

- BGはブルガリア政府行政登録`iisda.government.bg`のVisa D・非EU市民継続滞在許可ページを採用
- CYは新`gov.cy`ポータルのVisas・Entry/Residence手順・Visitors and family members・Immigration Permitsを採用
- 対象6 URLは調査時にHTTP 200と手続き本文を確認済み
- 対象6件のDB登録・再読込検証とBACKLOG更新が完了

## 完了した作業

- 作業開始手順と既存Git差分を確認
- 既登録`country_sources`を読み取り、今回6 URLが未登録であることを確認
- 既存seedのupsert・再読込検証方式と`country_sources`の一意制約`(country_code, url)`を確認
- `scripts/_seed-bg-cy-visa-sources.ts`を新規作成し、対象6件だけをupsert
- DB再読込で6/6件のURL・purpose・status・source・検証日時一致を確認
- 既存BG/CY対象外12件の前後完全一致、BG/CY総件数12→18件を確認
- `docs/BACKLOG.md`のBL-20260721-02を完了へ更新

## 変更する主要ファイル

- `scripts/_seed-bg-cy-visa-sources.ts`（新規）
- `docs/BACKLOG.md`
- `.ai/CURRENT_HANDOFF.md`
- `.ai/RECENT_ACTIVITY.md`
- DB: `country_sources` 対象6件

## Git状態・未コミット変更

- HEAD / origin/main: `6af6cc2`（一致）
- 開始前からの既存差分: `tsconfig.scripts.tsbuildinfo`、`tsconfig.tsbuildinfo`（今回対象外・保持）
- 開始前からの未追跡調査スクリプト・一時ファイルは変更・削除しない

## 実行済みの検証

1. 対象6 URLのHTTP 200確認
2. 各ページ本文にビザ・入国・居住許可の実手続き情報があることを確認
3. DB既登録URLを読み取り、対象6 URLが未登録であることを確認
4. 対象seedスクリプトのESLint: 通過（0 warning）
5. 対象seedスクリプトの単体TypeScript型チェック: 通過
6. DB upsert: 事前対象0件、対象6件を登録
7. DB再読込: 6/6件の保存値一致
8. 対象外比較: 既存BG/CY 12件不変、総件数12→18件
9. `git diff --check`: 通過

## 未実行の検証

- Next.js全体build（DB seed・記録変更のみのため未実行）
- 全scripts型チェック（多数の既存未追跡スクリプトを含むため未実行。今回対象は単体型チェック通過）

## 未解決事項

- なし

## 次に行う作業

1. commitのHEADと対象外差分が保持されていることを確認
2. pushは別途明示許可後に実行

## 禁止事項・注意事項

- 対象6 URL以外のDBレコードを変更しない
- 記事生成・再生成・公開は行わない
- 既存のビルド情報差分・未追跡ファイルを変更・commitしない
- pushは明示許可なしに実行しない

## ユーザー判断が必要な事項

- commitのpush許可
