# MoveWorth — Claude 運用ルール

## 記事公開フロー（visa 記事）

### 原則：明示的な承認なしに is_published: true にしない

`generate-country-article.ts` で生成した visa 記事は、**source-grounded 成功かどうかに関わらず**、
デフォルトで `is_published: false`（draft）として保存する。

公開するには `--publish` フラグを明示的に渡す必要がある。

```bash
# draft 保存（レビュー待ち）— デフォルト
npx tsx scripts/generate-country-article.ts be

# 公開（ユーザーの承認を得た後のみ実行）
npx tsx scripts/generate-country-article.ts be --publish
```

### 正しいフロー

1. **生成**: `generate-country-article.ts [code]` → `is_published: false` で保存
2. **レビュー**: ja 本文を提出し、ユーザーが内容を確認
3. **承認**: ユーザーが明示的に「公開してよい」と指示
4. **公開**: `--publish` フラグ付きで再実行、または Supabase ダッシュボードで手動 ON

### 違反を防ぐ注意点

- Claude が自律的に `is_published: true` をセットしてはならない
- 「source-grounded だから自動公開」は禁止。grounded であっても draft が原則
- GHA (auto-country) で自動公開する場合は、ワークフロー定義に `--publish` を明記し、
  事前にユーザーの承認を得ること

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

---

## コミット・プッシュ

スクリプト実行や記事生成後は必ず `git commit && git push` すること。

---

## 参照

- ビザ記事生成: `scripts/generate-country-article.ts`
- URL 検証・登録: `scripts/verify-country-sources.ts`
- 公開切り替え（個別）: Supabase ダッシュボード > blog_posts > is_published を手動で ON
