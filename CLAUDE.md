# MoveWorth — Claude Code 運用ルール

> 本ファイルはClaude Codeの入口であり、MoveWorth固有の安全ルールを定義する。
> 作業記録・エージェント交代・履歴整理の共通仕様は `docs/AI_WORKFLOW.md` を正とする。

## 0. 作業開始時に必ず確認するもの

コードやDBを変更する前に、次の順で確認すること。

1. `CLAUDE.md`
2. `docs/AI_WORKFLOW.md`
3. `.ai/DECISIONS.md`
4. `.ai/CURRENT_HANDOFF.md`
5. `docs/BACKLOG.md`（今回のタスクに関係する場合）
6. `01_要件定義書_仕様書.md` / `02_設計書.md`（必要な箇所のみ。両方とも初期版であることに注意）
7. `git status`
8. `git diff`

作業開始前に `.ai/CURRENT_HANDOFF.md` を更新し、目的・予定・現在の差分・注意事項を残すこと。
トークン上限到達後に引き継ぎを書く運用には依存しない。

---

## 1. 記事公開フロー（visa・study 共通）

### 原則：公開操作は再生成を伴ってはならない

**レビューされた内容とバイト単位で同一のものが公開されること。**

生成（draft保存）と公開（フラグ切り替え）は完全に分離された2ステップ操作とする。

```bash
# ステップ1: 生成（draft保存のみ）
# visa: blog_posts に is_published: false で保存
# study: study_blog_posts に is_published: false で保存
npx tsx scripts/generate-country-article.ts be

# ステップ2: 公開（フラグ切り替えのみ、再生成なし）
# ユーザーの明示的な承認後のみ実行
npx tsx scripts/generate-country-article.ts be --publish-only
```

### 正しいフロー

1. **生成**: 対象記事を `is_published: false` で保存
2. **レビュー**: 対象本文・数値・参照元・差分を提示
3. **承認**: ユーザーが明示的に公開を許可
4. **公開**: `--publish-only` 等、再生成を伴わない操作だけを実行
5. **検証**: 公開件数、対象スラグ、HTTP応答、意図しない公開がないことを確認

### 安全装置

- 既存の公開中記事を生成処理で自動上書きしない
- 廃止済みの再生成公開フラグを復活させない
- AIが自律的に `is_published: true` を設定しない
- source-groundedでも自動公開しない
- `example.com`、拒否メッセージ、空本文、構造不正があれば書き込みまたは公開を停止する
- 一括生成・一括更新・一括公開はユーザーの明示的な許可なしに実行しない

---

## 2. 生成品質・一次情報ルール

### 税制・ビザ・就労・留学制度

- 税率、閾値、申請費用、就労時間、最低所得、投資額等の具体的数値は、登録済み一次情報の本文で確認できた場合のみ記述する
- ソース範囲外の数値をモデル知識だけで補完しない
- 確認できない場合は、公式機関での確認を促し、数値を創作しない
- 政府機関、税務当局、公的機関、官報、公式法令DBを優先する
- 移住コンサル、代行業者、アフィリエイトサイト等の民間二次情報を一次情報として扱わない
- URLはHTTP到達性だけでなく、ページ本文が目的の情報を実際に含むことまで確認する

### 家賃・生活費・給与

- モデル知識のみの補完を禁止する
- 政府統計、公的統計、公式データ、またはユーザーが承認した検証済みデータを使用する
- 推測によるインフレ補正、恣意的な上乗せ・減額を行わない
- 数値の対象（全国、都市、世帯類型、単身、外国人居住地域等）を明示する
- 出典と対象条件が一致しない場合は、断定せず未検証として扱う

### TN（チュニジア）特別制約

- 登録ソースが外国人雇用・労働法である場合、ビザ申請手続きの根拠として流用しない
- 就労ルール等はソース範囲内だけを記述する
- ビザ申請手続き・費用等を確認できない場合は、在日大使館・領事館等の公式窓口へ誘導する
- プレースホルダーURLを絶対に書かない

---

## 3. `country_sources` 運用ルール

- 記事生成前に、対象分野の一次情報URLを `country_sources` に登録する
- 登録前にHTTP到達性と本文内容を確認する
- ソース未登録・本文取得不能・目的不一致は異常系としてdraftを維持する
- SPA等で本文取得不能な場合、公式PDF、官報、法令DB、別言語公式ページ等を優先して再調査する
- Wayback Machineは現行一次情報の代替ではなく、履歴確認が必要な場合の補助として扱う
- 手動確認済みURLは、確認方法と確認日を追跡可能な形で登録する

### 現行の `purpose` 値

| 値 | 用途 |
|---|---|
| `visa` | ビザ・移住手続き |
| `study` | 留学・教育・学生制度 |
| `general` | その他の公的一般情報 |
| `tax` | 税率・税制度 |
| `salary` | 給与・所得統計 |
| `living_cost` | 家賃・生活費等の公的統計 |

新しい値を追加する場合は、実DBのCHECK制約と関連コードを確認し、ユーザー承認後に変更すること。

---

## 4. DB書き込み・部分更新ルール

- `blog_posts` へのinsert/update前に `assertBlogPayload()` を呼ぶ
- `study_blog_posts` にも同等の構造・拒否パターン・URL検証を適用する
- upsert/updateには、明示的に変更するフィールドだけを含める
- `thumbnail`、`is_published`、他言語本文等を意図せず巻き込まない
- 既存レコードの部分修正では、原則としてターゲットパッチを使用する
- `force-regenerate` は情報欠落・既存内容破壊のリスクがあるため、**実行のたびにユーザーの明示的許可を得ること**。セッション内の包括許可、過去タスクの許可、類似処理への許可を流用してはならない
- DB操作前に対象件数を確認し、実行後に更新件数と意図しないフィールド変更を比較する
- 本番データの削除、広範な更新、マイグレーションはユーザー承認が必要

```ts
import { assertBlogPayload } from "./utils/validate-blog-payload";
assertBlogPayload({ title, description, content, locales }, slug);
```

---

## 5. 完了報告・機械検証

「完了しました」「問題ありません」だけで完了扱いにしない。

必ず次を明示すること。

- 何を変更したか
- 変更した主要ファイル
- 何をどの方法で検証したか
- 検証対象件数
- 成功・失敗・未実行
- 未解決事項
- ユーザー判断が必要な事項
- 関連コミット

代表的な検証：

- DB書き込みを伴う作業: `scripts/inspect-all-blog-posts.ts` 等で構造不正0件を確認
- 公開・デプロイを伴う作業: `scripts/check-published-slugs-http.ts` 等で対象HTTP応答を確認
- Next.js: lint / typecheck / build
- scripts: `npx tsc --project tsconfig.scripts.json --noEmit`
- 対象件数、公開状態、保護対象除外、更新前後差分を確認

検証していない項目は、未検証と明記する。

---

## 6. tsconfig分離

- Next.jsビルド: `tsconfig.json`（`scripts/` を除外）
- scripts型チェック: `tsconfig.scripts.json`
- GHA `scripts-typecheck.yml` がpush時にscripts型チェックを実行

`scripts/` の型エラーが本番ビルドを壊さない構成を維持しつつ、scripts側の型チェックを省略しない。

---

## 7. 外部提出済み記事の変更保護

以下のスラグはアフィリエイト広告主に掲載URLとして提出済み。

```text
saily-esim-review-overseas-travel-guide-2026
nordvpn-overseas-japanese-guide-2026
suika-vpn-overseas-japanese-streaming-guide-2026
```

適用ルール：

1. アフィリエイトリンク、料金記述、URL・トラッキングパラメータは変更禁止
2. 一括処理、apply系、force-regenerate、広範なパッチ処理ではデフォルトで除外する
3. それ以外の明白な異物（AI拒否テキスト、明らかなプレースホルダー、本文と無関係な異常文字列等）の除去は、対象箇所と変更差分を示し、**ユーザーの都度承認を得た場合のみ**実行できる
4. 異物除去の許可を、リンク・料金・パラメータの変更許可として解釈しない
5. EN / ZH更新時も、JAのアフィリエイトリンク、料金記述、パラメータを変更しない
6. 書き込み前後で保護対象のリンク・料金・パラメータを機械比較する
7. `is_promotion` 等の本文非破壊フラグも、対象件数と影響範囲を確認する

---

## 8. Git・コミット・push

- 作業開始時と終了時に `git status` と `git diff` を確認する
- 意味のある作業単位、またはエージェント交代前に、チェックポイントcommitを自由に作成できる
- コミット前に秘密情報、一時ファイル、生成物、意図しない変更を確認する
- **pushは、ユーザーの明示的許可または現在のタスク内の明示的指示がある場合のみ実行する**。許可を別タスク・別セッションへ持ち越さない
- pushでVercelやGitHub Actionsが起動する可能性を考慮する
- 未コミット変更を理由なく破棄、reset、checkout、全面上書きしない
- Claude CodeとCodexを同じworktreeで同時編集させない

---

## 9. AI作業記録・引き継ぎ

詳細は `docs/AI_WORKFLOW.md` を参照する。

最低限：

- 作業開始前に `.ai/CURRENT_HANDOFF.md` を更新
- 意味のある実装単位が完了するたびに現在地を更新
- 危険操作前・方針変更時・検証後に更新
- 作業終了時に `.ai/RECENT_ACTIVITY.md` へ簡潔に追記
- 恒久判断は `.ai/DECISIONS.md`
- 未完了の将来タスクは `docs/BACKLOG.md`
- コード全文・diff全文・長いログをメモに複製しない

---

## 10. 参照

- 共通AI運用: `docs/AI_WORKFLOW.md`
- 現在地: `.ai/CURRENT_HANDOFF.md`
- 直近履歴: `.ai/RECENT_ACTIVITY.md`
- 恒久判断: `.ai/DECISIONS.md`
- backlog: `docs/BACKLOG.md`
- ビザ記事生成: `scripts/generate-country-article.ts`
- URL検証・登録: `scripts/verify-country-sources.ts`
