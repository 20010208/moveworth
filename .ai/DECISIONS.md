# MoveWorth Decisions

最終更新: 2026-08-09

## DEC-20260721-01: 生成と公開を分離する

- 日付: 2026-07-21（既存方針を文書化）
- 状態: 採用
- 決定者: ユーザー

### 決定

記事生成はdraft保存、公開はレビュー後のフラグ切り替えのみとする。公開操作で再生成しない。

### 理由

レビューした本文と公開本文の同一性を保証し、誤情報や拒否メッセージの自動公開を防ぐため。

### 影響範囲

visa / visa-guide / study-country / study-work / guide / simulator等の生成・公開処理。

---

## DEC-20260721-02: 数値は一次情報・公的統計でgroundingする

- 日付: 2026-07-21（既存方針を文書化）
- 状態: 採用
- 決定者: ユーザー

### 決定

税率、ビザ、就労、給与、家賃、生活費等の具体的数値をモデル知識だけで補完しない。政府・公的機関・公的統計等で確認し、未確認なら創作しない。

### 理由

旧税率、対象条件の混同、推測補正等による誤情報を防ぐため。

---

## DEC-20260721-03: 部分修正はターゲットパッチを優先する

- 日付: 2026-07-21（既存方針を文書化）
- 状態: 採用
- 決定者: ユーザー

### 決定

既存記事・データの一部を直す場合、全面再生成より対象フィールド・対象セクションだけを更新する。

### 理由

force-regenerateで実務情報や既存内容が欠落した事故を再発させないため。

---

## DEC-20260721-04: 外部提出済み記事を保護する

- 日付: 2026-07-21（既存方針を更新）
- 状態: 採用
- 決定者: ユーザー

### 決定

`saily-esim-review-overseas-travel-guide-2026` と `nordvpn-overseas-japanese-guide-2026` について、アフィリエイトリンク、料金記述、URLパラメータは変更禁止とする。

それ以外の明白な異物（例: AI拒否テキストの混入、明らかなプレースホルダー、記事本文と無関係な異常文字列）の除去は、対象箇所と変更内容を示し、ユーザーの都度承認を得た場合に限り実行できる。

一括処理、apply系、force-regenerate等では引き続きデフォルト除外とし、包括的な変更許可として扱わない。

### 理由

広告主へ提出済みのリンク・料金・トラッキング条件を保護しつつ、明白な品質事故を修正不能な状態にしないため。

---

## DEC-20260721-05: Claude Codeを第一実装、Codexをフォールバック実装とする

- 日付: 2026-07-21
- 状態: 採用
- 決定者: ユーザー

### 決定

通常はClaude Codeがメイン実装を担当し、利用上限到達時や別調査時にCodexが同じリポジトリを引き継ぐ。

### 理由

Claude Codeの既存文脈を活かしつつ、トークン上限で開発が停止する問題を軽減するため。

### 制約

同じworktreeで同時編集しない。交代時は共通記録とGit差分を確認する。

---

## DEC-20260721-06: 現在地・直近履歴・恒久判断を分離する

- 日付: 2026-07-21（2026-08-09: `.ai/RECENT_ACTIVITY.md`の保持方針を実態へ合わせ更新）
- 状態: 採用
- 決定者: ユーザー

### 決定

- 現在地: `.ai/CURRENT_HANDOFF.md`
- 直近の作業履歴（working log）: `.ai/RECENT_ACTIVITY.md`。保持期間は目安数日〜1週間程度とするが、**厳密なTTLによる機械的削除は行わない**。肥大化した場合は履歴を失わない形で`.ai/archive/`等へ移動する（削除ではなく移動）
- 恒久判断: `.ai/DECISIONS.md`
- 未完了: `docs/BACKLOG.md`
- コード詳細: Git

### 理由

突然のトークン切れに備えつつ、単一メモの肥大化と重要情報の削除を防ぐため。「直近3日で機械的に削除する」という当初の運用は、実際には削除が行われないまま2週間分以上が蓄積する実態と乖離していたため、2026-08-09に運用実態（目安ベースの保持＋アーカイブ移動）へ合わせて修正した。

---

## DEC-20260721-07: pushを既定で明示許可制にする

- 日付: 2026-07-21
- 状態: 採用
- 決定者: PM（Sonnet）、ユーザー委任

### 決定

commitはチェックポイントとして自由に作成できる。pushのみ、ユーザーの明示的許可または現在のタスク内の明示指示がある場合に限り実行する。

### 理由

Vercel / GitHub Actionsの意図しない起動リスクを抑え、中途状態が外部へ反映されることを防ぐため。ローカルの安全な復旧点としてcommitは必要だが、pushは外部作用を伴うため権限を分離する。

### 運用

- エージェント交代前や意味のある作業単位でチェックポイントcommitを作成してよい
- push許可を、将来の別タスクや別セッションへ自動的に持ち越さない
- push前に対象ブランチ、差分、起動するVercel / GHAを確認する

---

## DEC-20260721-08: C-5給与・生活費grounding方法論

- 日付: 2026-07-21
- 状態: 採用
- 決定者: ユーザー（Koki）

### 決定

- データは利用可能な最新年を優先し、手法の完全統一は二の次とする
- 生活費はCP041（実家賃）+ CP042（帰属家賃）のみ差し引く
- CP045（光熱費）は `referenceLivingCost` に残す
- 業種別年収はEurostatの全労働者平均を採用し、エクスパット推定値は使用しない
- 各国統計局データを推計値で代替しない。取得できない場合は「取得不可」と明示する

### 理由

国ごとに公開形式や統計体系が異なるため、形式上の統一よりも、最新かつ一次情報に基づく実測値を優先する。生活費では家賃の二重計上だけを除き、光熱費を生活費から誤って除外しない。給与では検証不能なエクスパット推定を避け、取得不能を推計で隠さない。

### 適用範囲

- `country_presets.referenceLivingCost`
- `industry-salaries`
- Eurostat CP041 / CP042 / CP045を用いる処理
- ONS、厚生労働省等の各国統計局データ取得

---

## DEC-20260809-01: Study publication retry semanticsを経路別に分離する

- 日付: 2026-08-09（2026-08-09内で実装挙動との矛盾を訂正・再文書化）
- 状態: 採用
- 決定者: PM（Sonnet）、ユーザー委任

### 決定

study記事の公開ブロック時のretry仕様を、公開経路ごとに明確に分離する。「MoveWorthではautomatic retryを一律禁止する」という単一ルールは採らない。

**通常/manual publication**（`--publish-only`等の既存手動publish経路、および既存の週次Country/Work publisher）:
品質チェック（`validateStudyPublication`）でblockされた場合、独立した自動retry機構は設けない。GitHub Issueによる通知のみを行い、修正後の再公開は人が明示的な再検証・publish操作を行うことを前提とする。

**Scheduled Publication**（`scheduled_publish_at`による予約記事、`scripts/publish-scheduled-study.ts`）:
予約日時到達時にvalidator FAILとなった場合、draftを維持し`scheduled_publish_at`も変更せず保持したままGitHub Issueで通知する。これにより、翌日以降の日次実行でも候補クエリ（`is_published=false AND scheduled_publish_at IS NOT NULL AND scheduled_publish_at <= now()`）に該当し続け、**Scheduled Publisher自身によって毎日自動的に再評価される**。source改善等でvalidatorがPASSに転じた時点で、そのまま自動publishされる（実コード`scripts/publish-scheduled-study.ts`で確認済みの実装挙動）。これは意図的なScheduled Publish固有のretry semanticsであり、バグではない。

### 理由

Scheduled Publicationは、ユーザーが事前に公開日時を明示的に予約した記事であり、その予約自体が「条件（PASS）が整い次第の自動publicationへの承認トリガー」として機能する。一方、通常のmanual/週次publisherには事前の日時予約という承認トリガーが存在しないため、DEC-20260721-01（生成と公開の分離）・DEC-20260721-07（pushの明示許可制）と同じ思想で、人による明示的なretryトリガーを維持する。

### 注意事項

- Issue auto-close（`docs/BACKLOG.md` BL-20260809-12）は未実装のため、Scheduled Publisherが後日の自動再評価でPASSしpublishに成功しても、対応する`[study-publish][slug:<slug>] publication blocked` Issueは自動closeされない。この点はBACKLOGの既知課題のまま残る
- `scheduled_publish_at`はpublish成功後もクリアされず、監査記録としてそのまま保持される（`is_published=true`により候補クエリの対象から自然に外れるため、再publishは発生しない）

### 影響範囲

- `scripts/publish-scheduled-study.ts`（Option C運用方針・Scheduled固有retry semantics）
- `scripts/utils/study-publish-issue.ts`
- `scripts/publish-study-country-next.ts` / `scripts/publish-study-work-next.ts`（manual/週次系、独立自動retryなしのまま）
- 将来、既存Country/Work publisherへ同種の自動retry機構を検討する場合も、本decisionの再確認が必要
