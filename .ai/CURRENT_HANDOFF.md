# Current Handoff

最終更新: 2026-07-29
最終担当: Claude Code
タスクID: BUILD-STUDY-ABROAD-RESEARCH-PIPELINE-20260728
状態: 実装・型チェック・dry-run検証完了。commit・push未実施（ユーザー許可待ち）

## 目的

留学シミュレーター（`study-abroad.ts`）への国データ追加を支援する調査パイプラインを実装する。
（前タスクの調査結果: `study-abroad.ts`は静的TSファイルであり、`simulator_personas`のような自動DB追加はできない。学費データの一次情報も不在。そのため「完全自動追加」ではなく「調査結果を人間が確認・完成させるための支援スクリプト」として実装した）

## 実装内容

1. `scripts/research-study-abroad-entry.ts`（新規）
   - 対象: 最新のdraft `visa-{code}`（CLI引数で国コードを直接指定して手動実行も可能）
   - `study-abroad.ts`に既存の場合はスキップ
   - `country-presets.ts`の`referenceLivingCost`から`livingMin/Max`を算出（livingMin=referenceLivingCost、livingMax=referenceLivingCost×1.5の明記された係数で導出）
   - `country_sources`（purpose IN visa,study・status=alive）の登録済み公式ソースのみ取得し、student visa要件・費用・期間等をGPTで「本文に明記されている内容のみ抽出、なければTODO」というプロンプトで抽出
   - 学費（tuition）・人気都市・大学・overview・tips・japaneseInfoは一次情報カテゴリが存在しないため常にTODO
   - `study-abroad.ts`への追記コードを生成するが、ファイルへの書き込み・commitは一切行わない
   - レポート（OS一時ディレクトリへ出力）はGHA側でIssue化する想定
2. `.github/workflows/research-study-abroad.yml`（新規）
   - 毎週土曜09:00 JST（`0 0 * * 6`）+ `workflow_dispatch`（dry_run入力対応）
   - レポート生成時に`gh issue create`でIssue化（GitHub標準のIssue通知＝監視者へメール通知）
   - SendGrid経由の直接メール送信は`secrets.SENDGRID_API_KEY`が設定されている場合のみ任意実行（未設定なら自動スキップ、今回は新規シークレット追加なし）
3. `docs/BACKLOG.md`
   - `BL-20260728-01`（study-abroad.tsのDBテーブル化、中期対応として新規登録）
   - `BL-20260728-02`（学費データ一次情報調査、本パイプラインで部分対応のため「調査中」として新規登録）

## dry-run検証で発見・修正したバグ

- 当初、レポートの「取得できた項目」判定が`visa`オブジェクトの有無だけで行われており、GPTが「本文に記載なし」と正しく判断してTODOセンチネルを返した場合でも「取得済み」と誤表示していた
- 各フィールドの値が実際にTODOセンチネル文字列と一致するかどうかで判定するよう修正（RO/HUの実データで再検証し、正しくTODO判定されることを確認）

## 変更した主要ファイル

- `scripts/research-study-abroad-entry.ts`（新規、未commit）
- `.github/workflows/research-study-abroad.yml`（新規、未commit）
- `docs/BACKLOG.md`（`BL-20260728-01`・`02`追加）
- `.ai/CURRENT_HANDOFF.md` / `.ai/RECENT_ACTIVITY.md`

## Git状態

- 前回commit（`1873298`）はpush済み
- 今回分は全て未commit
- `src/data/study-abroad.ts`・`src/data/country-presets.ts`は変更されていないことを`git status`で確認済み（スクリプトが書き込みを行っていないことの裏付け）

## 実行済みの検証

1. `npx tsc --project tsconfig.scripts.json --noEmit`: エラー0件
2. `DRY_RUN=true`で対象なし（現在draft visa無し）のケースを確認 → 正常に早期終了
3. CLI引数で`ro`・`hu`を指定し、実際に`country_sources`から複数ソース（Wayback URL含む）を取得できることを確認
4. `ro`で実際にOpenAI抽出まで実行 → 登録ソースに学生ビザ固有の記載がなかったため全フィールドTODOとなり、モデル知識による補完が発生していないことを確認（意図通りの安全動作）
5. `git status`で`study-abroad.ts`等への書き込みが発生していないことを確認

## 未解決事項

- なし（本タスク範囲内）
- `BL-20260728-01`（DBテーブル化）・`BL-20260728-02`（学費データ調査）は別タスクで対応予定

## 次に行う作業

1. ユーザーへ実装概要を報告済み
2. ユーザー承認後、commit・push

## 禁止事項・注意事項

- `study-abroad.ts`への自動書き込み・自動commitは行っていない
- 取得不可の数値をAIに推測させていない
- 民間サイト・比較サイトは使用していない（`country_sources`の登録済み公式ソースのみ）
- commit・pushはユーザー許可後

## ユーザー判断が必要な事項

- 実装内容の承認
- commit・push可否
- `secrets.SENDGRID_API_KEY`等を設定してカスタムメール送信を有効化するかどうか（未設定でもGitHub Issue通知は機能する）
