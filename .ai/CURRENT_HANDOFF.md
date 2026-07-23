# Current Handoff

最終更新: 2026-07-22
最終担当: Claude Code
タスクID: FIX-BL-20260722-03-STUDY-PUBLISH-MISS
状態: 本番実行・検証・BACKLOG更新完了。commit実施中

## 目的

`BL-20260722-03`（同日複数visa公開時のstudy自動公開取りこぼし）の恒久修正。

## これまでの経緯

1. 1回目の修正（`.limit(1)`廃止・日付範囲lookback・MAX_PER_RUN・DRY_RUN追加）を実装しdry-run実行
2. `publish-study-country-next.ts`のdry-runは期待通り（visa-rs対象1件、visa-tr既公開スキップ、DB更新0件）
3. `publish-study-work-next.ts`のdry-runで**誤検知**を発見:
   - 対象範囲(2026-07-12〜07-18)に開局時の一括公開バッチ34件（th/gb/pl/tn/sg/bg/be/au/ee/dk/it/ph/nl/de/ca/no/gr/mt/hk/se/in/hr/ae/tw/kr/my/us/fr/ie/ge/at/cz/jp/nz）が日付的に混入
   - 全34件、対応するstudy-work-{code}（またはstudy-{code}）は**既に公開済み**（34/34確認済み）で実際のアクションは0件のはずだが、MAX_PER_RUNの判定が「日付範囲内の生visa件数」に対して行われていたため誤って中断（exit 1）していた
4. 追加修正案（MAX_PER_RUNを「実際に公開が必要な未公開対象件数」に対して判定する二段階方式）をユーザーへ提示しレビュー承認済み

## 承認された追加修正内容

両スクリプトを以下の二段階方式へ変更する:

1. **Phase 1（分類）**: 全visa候補をループし、対象slugが「存在しない」「既に公開済み」なら即座にログ出力してスキップカウント、「存在し未公開」ならアクション対象リストへ追加（contentも保持、二重取得を避ける）
2. **Phase 2（キャップ判定）**: アクション対象リストの件数が`MAX_PER_RUN`を超える場合のみ中断。既に公開済み・存在しないものはキャップ判定に影響しない
3. **Phase 3（実行）**: アクション対象のみ品質チェック→公開（またはDRY_RUN表示）

`publish-study-work-next.ts`は`study-work-{code}`→`study-{code}`のフォールバック判定も分類フェーズ内で完結させる（`classify()`関数）。

## 実装手順（ユーザー承認済み）

1. 両ファイルを二段階方式へ書き換え
2. `npx tsc --project tsconfig.scripts.json --noEmit`
3. `DRY_RUN=true npx tsx scripts/publish-study-country-next.ts`（期待: study-country-rs対象1件、study-country-tr既公開スキップ）
4. `DRY_RUN=true npx tsx scripts/publish-study-work-next.ts`（期待: 34件全スキップ判定→MAX_PER_RUN判定を通過してexit 0）
5. 結果をユーザーへ報告。本番実行・DB変更・commit・pushはユーザーの追加承認後

## 変更した主要ファイル（このタスク）

- `scripts/publish-study-country-next.ts`（二段階方式へ再書き換え）
- `scripts/publish-study-work-next.ts`（二段階方式へ再書き換え）
- `.ai/CURRENT_HANDOFF.md`

## Git状態・未コミット変更

- 前回commit（`c1e49ee`）はpush済み
- 今回の2ファイルは未commit（dry-run再検証後、本番実行承認後にcommit予定）
- 既存の対象外差分（tsbuildinfo、未追跡一時スクリプト群等）は継続・不変

## 実行済みの検証

1. `npx tsc --project tsconfig.scripts.json --noEmit`: エラー0件
2. dry-run（study-country）: 候補2件（visa-tr, visa-rs）→ visa-trは既公開スキップ、visa-rsのみアクション対象1件 → 🟡[DRY RUN]表示、exit 0
3. dry-run（study-work）: 候補34件（開局時バッチ）→ 全34件がstudy-work-{code}既公開でスキップ、アクション対象0件、MAX_PER_RUN判定に抵触せずexit 0（誤検知が解消したことを確認）

## 未解決事項

- なし（本タスク範囲内、本番実行はユーザー承認待ち）

## 本番実行結果

- `npx tsx scripts/publish-study-country-next.ts`（DRY_RUNなし）実行
- `study-country-tr`: 既に公開済み → スキップ
- `study-country-rs`: ✅ 公開（is_published: false→true）
- DB更新: 1件のみ
- 本番実行前後でstudy_blog_posts全114件のスナップショットを比較 → 対象外113件は完全一致（変化0件）、`study-country-rs`のみ`is_published: true`に変化
- `publish-study-work-next.ts`は今回未実行（ユーザー指示によりスキップ、対象0件のため）

## 次に行う作業

1. 結果をユーザーへ報告済み
2. commit・pushはユーザー指示待ち

## 禁止事項・注意事項

- dry-run段階では実際のDB更新（`is_published`変更）を一切行わない
- commit・pushはユーザーの本番実行承認後
- 一括公開はしない（MAX_PER_RUNキャップを維持、ただし判定基準はアクション対象件数に変更）
- force-regenerateは使用しない

## ユーザー判断が必要な事項

- dry-run結果を見た上での本番実行可否
