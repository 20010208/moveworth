# Current Handoff

最終更新: 2026-07-22
最終担当: Claude Code
タスクID: ADD-MIRICANVAS-ARTICLE-20260722
状態: JA承認済み、EN/ZH確認・BACKLOG登録完了、commit実施中

## 目的

新規アフィリエイト記事「MiriCanvas」を2サイトへ作成する。

- スラグ: `miricanvas-ai-presentation-guide-2026`（両テーブル共通）
- `blog_posts`（moveworthapp.com）: category=money, is_promotion=true
- `study_blog_posts`（study.moveworthapp.com）: category=guide
- 言語: JA/EN/ZH（3言語フル執筆）
- `is_published: false`（draft保存のみ、公開はユーザー承認後の別ステップ）
- アフィリエイトリンク: `<a href="https://abr.ge/0xaw24">MiriCanvas公式サイトはこちら</a>`（href・表示テキスト変更禁止）

## 事前調査で判明した重要事項

1. **study_blog_postsのスキーマがblog_postsと異なる**
   - カラム: `id, slug, category, date, reading_time, title, description, content, is_published, created_at, thumbnail, thumbnail_ja, thumbnail_en, thumbnail_zh`
   - `is_promotion`カラムが**存在しない**（blog_postsのみに存在）→ study_blog_posts側では設定不可、本文中の【PR】表記のみでPR開示を担保する
   - `locales`カラムも存在しない、`published_at`ではなく`date`、`reading_minutes`ではなく`reading_time`
   - `category`は`guide`/`work`/`country`の3値のみ有効（`guide`は指定通り使用可）
2. **study-blog-post-content.tsxのレンダラーは`<!-- html -->`ブロックに非対応**（blog-post-content.tsxとは別実装）
   - 生の`<a>`タグを埋め込んでも、study.moveworthapp.com側ではクリックできない文字列になる（dangerouslySetInnerHTMLの仕組み自体が存在しない）
   - 対応: study_blog_posts側の本文では、href・表示テキストを変えずMarkdownリンク形式`[MiriCanvas公式サイトはこちら](https://abr.ge/0xaw24)`で実装する（blog_posts側は指示通り生HTML+`<!-- html -->`マーカーで実装）
   - この差異はユーザーへ提示時に明記する
3. 両テーブルとも同slugでの既存レコードなしを確認済み
4. `CLAUDE.md`セクション7のPROTECTED_SLUGSに`miricanvas-ai-presentation-guide-2026`を追加済み（未commit）

## 本タスクでの変更予定

- `scripts/post-miricanvas-article.ts`（新規）で両テーブルへdraft insert
- `blog_posts`: slug, category:money, published_at, reading_minutes, thumbnail:null, title/description/content(ja/en/zh), locales:["ja","en","zh"], pinned:false, is_published:false, is_promotion:true
- `study_blog_posts`: slug, category:guide, date, reading_time, title/description/content(ja/en/zh), is_published:false（thumbnail系はnull据え置き）
- 本文に作成日「2026年7月22日」を目視確認できる形で記載
- assertBlogPayload（locales:["ja","en","zh"]指定）を両テーブル分実行
- アフィリエイトhref・禁止パターン・example.com混入チェック

## 変更した主要ファイル

- `CLAUDE.md`（セクション7 PROTECTED_SLUGS追加、未commit）
- `.ai/CURRENT_HANDOFF.md`
- （予定）`scripts/post-miricanvas-article.ts`（新規）
- DB（予定）: `blog_posts`・`study_blog_posts`に各1件、is_published:false

## Git状態・未コミット変更

- `CLAUDE.md`: 本タスクでの追加（未commit）
- 既存の対象外差分（tsbuildinfo、未追跡一時スクリプト群等）は継続・不変

## 実行済みの検証

1. `npx tsc --project tsconfig.scripts.json --noEmit`: エラー0件
2. `npx tsx scripts/post-miricanvas-article.ts`: assertBlogPayload通過（両テーブル）・insert成功
   - blog_posts: JA 2357字 / EN 4424字 / ZH 1870字
   - study_blog_posts: JA 2059字 / EN 4126字 / ZH 1572字
3. アフィリエイトhref出現確認（両テーブル・全言語）、禁止パターン・example.com混入0件、作成日「2026年7月22日」記載確認
4. `inspect-all-blog-posts.ts`: blog_posts 98件（公開94・非公開4）構造不正0件、study_blog_posts 115件 zh全生成済み・example.com/GPT拒否0件
5. DB再取得で両テーブルの主要フィールド（is_published:false, category, is_promotion, locales等）確認

## 未解決事項

- なし（本タスク範囲内）

## 次に行う作業

1. JA本文（両テーブル分の差異を明記して）をユーザーにレビュー提示済み
2. ユーザー承認後、公開判断（このセッションでは公開しない）

## 禁止事項・注意事項

- アフィリエイトリンクのhref（`https://abr.ge/0xaw24`）・表示テキストは変更・削除禁止
- study_blog_posts側はレンダラー制約によりMarkdownリンク形式を使用（href・表示文言は同一）
- 承認前に is_published を true にしない
- study_blog_postsに存在しない`is_promotion`等のカラムを無理に設定しない

## ユーザー判断が必要な事項

- JA本文（blog_posts版・study_blog_posts版のリンク形式差異を含む）レビュー・承認
- study_blog_postsにis_promotionカラムがないことの了承（またはスキーマ変更要否の判断）
- 公開可否・タイミング
