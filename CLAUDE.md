# MoveWorth — Claude 運用ルール

## 記事公開フロー（visa 記事）

### 原則：公開操作は再生成を伴ってはならない

**レビューされた内容とバイト単位で同一のものが公開されること。**

生成（draft保存）と公開（フラグ切り替え）は完全に分離された2ステップ操作。

```bash
# ステップ1: 生成（draft保存のみ）
npx tsx scripts/generate-country-article.ts be

# ステップ2: 公開（フラグ切り替えのみ、再生成なし）
# ユーザーの承認を得た後のみ実行
npx tsx scripts/generate-country-article.ts be --publish-only
```

### 正しいフロー

1. **生成**: `generate-country-article.ts [code]` → `is_published: false` で保存
2. **レビュー**: ja 本文を提出し、ユーザーが内容を確認
3. **承認**: ユーザーが明示的に「公開してよい」と指示
4. **公開**: `--publish-only` で実行（再生成なし、フラグ切り替えのみ）

### 実装上の安全装置

- `generate` 実行時、既存の公開中記事（is_published=true）は上書きしない（自動スキップ）
- `--publish`（旧フラグ、再生成して公開）は廃止済み。実行するとエラー終了
- Claude が自律的に `is_published: true` をセットしてはならない
- 「source-grounded だから自動公開」は禁止。grounded であっても draft が原則

---

## visa 記事の生成品質ルール

### 税制情報（所得税率・閾値）の扱い

所得税率・税率閾値などの税制情報は **ソース原文に具体的な数字がある場合のみ** 記述する。

ソース範囲外（登録済みソースがビザ手続きのみで税制ページを含まない場合等）の場合：
- 具体的な数字・閾値を書かない
- 「最新の税制は移住先国の税務当局または公式情報でご確認ください」と誘導する

生活費・家賃の目安は知識ベースで補完してよい（誤差が許容される情報のため）。

### TN（チュニジア）特別制約

- ソースは「外国人雇用・労働法」であり、ビザ申請手続きの一次情報ではない
- 就労ビザの 30% ルール、ANETI 許可等 → ソース根拠で記述
- ビザ申請手続き・申請費用・学生ビザ → 「在日チュニジア大使館または領事館にお問い合わせください」に誘導
- `example.com` などのプレースホルダー URL を絶対に書かない

### example.com チェック

生成後に `example.com` 文字列が含まれていた場合は `is_published` を強制 `false` にしてエラー出力する。
（`generate-country-article.ts` に実装済み）

---

## country_sources 運用ルール

- ビザ記事を生成する前に対象国の一次情報 URL を `country_sources` に登録すること
- 登録は `verify-country-sources.ts` または個別 seed スクリプトで行う
- ソース未登録での生成は異常系（`is_published: false` + GHA warning）
- ソースが SPA / JavaScript 必須の場合は Wayback Machine スナップショットを自動試行
- 手動で確認済みの URL は seed スクリプトで直接登録可（`source: "manual"`）

### purpose の許可値

`purpose` カラムの CHECK 制約で許可されている値：

| 値 | 用途 |
|---|---|
| `visa` | ビザ・移住手続きの一次情報 |
| `study` | 語学学校・留学情報 |
| `general` | その他の一般情報 |
| `tax` | 税務当局の税率・制度ページ |

**新しい `purpose` 値を追加する場合は、Supabase SQL Editor で CHECK 制約の更新が必要：**
```sql
ALTER TABLE country_sources
  DROP CONSTRAINT IF EXISTS country_sources_purpose_check;
ALTER TABLE country_sources
  ADD CONSTRAINT country_sources_purpose_check
  CHECK (purpose IN ('visa', 'study', 'general', 'tax', '新しい値'));
```

---

## 完了報告のルール

**完了報告には機械的な検証結果を含めること。目視や推測での完了宣言は不可。**

- DB 書き込みを伴う作業: `scripts/inspect-all-blog-posts.ts` を実行し「構造不正: 0 件」を確認
- 本番デプロイを伴う作業: `scripts/check-published-slugs-http.ts` を実行し「○件中○件 200 OK」を確認
- 「完了しました」「問題ありません」等の宣言は、上記スクリプトの出力を添えた場合のみ有効

---

## DB 書き込みバリデーション

`blog_posts` への insert/update 前に必ず `assertBlogPayload()` を呼ぶこと。

```ts
import { assertBlogPayload } from "./utils/validate-blog-payload";
assertBlogPayload({ title, description, content, locales }, slug);
// 不正な場合は throw して書き込まない
```

対象スクリプト（実装済み）:
- `generate-blog-post.ts`
- `generate-simulator-article.ts`
- `generate-country-article.ts`
- `fix-tax-sections.ts`

新しくスクリプトを追加する場合も同様に適用すること。

---

## tsconfig 分離

- **Next.js ビルド**: `tsconfig.json`（`scripts/` を除外）
- **scripts 型チェック**: `tsconfig.scripts.json`（`npx tsc --project tsconfig.scripts.json --noEmit`）
- GHA `scripts-typecheck.yml` が push 時に scripts/ の型チェックを自動実行する

`scripts/` の型エラーが本番ビルドを壊さないよう分離済み。
ただし scripts/ の型チェックは GHA で引き続き検証される。

---

## 外部提出済み記事の変更保護リスト

以下のスラグは **アフィリエイト広告主に掲載 URL として提出済み**。

```
saily-esim-review-overseas-travel-guide-2026
nordvpn-overseas-japanese-guide-2026
```

### 適用ルール（全 Claude セッションで厳守）

1. **JA 本文（特にアフィリエイトリンクの HTML・URL・パラメータ）は一切変更禁止**
2. **一括処理（apply 系・force-regen・パッチ系）はデフォルトでこのリストを除外**
   - `apply-ref-labels.ts` の `PROTECTED_SLUGS` 定数で実装済み
   - 除外解除はユーザーの明示的な指示がある場合のみ
3. **EN/ZH 本文の更新は許可。ただし：**
   - `content.ja` には 1 バイトも触れない
   - a8.net の URL・パラメータが JA 版と完全一致することを機械チェックしてから書き込む
4. `is_promotion: true` フラグや PR バナー表示は許可（content 非破壊）

---

## コミット・プッシュ

スクリプト実行や記事生成後は必ず `git commit && git push` すること。

---

## 参照

- ビザ記事生成: `scripts/generate-country-article.ts`
- URL 検証・登録: `scripts/verify-country-sources.ts`
- 公開切り替え（個別）: Supabase ダッシュボード > blog_posts > is_published を手動で ON
