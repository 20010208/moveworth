# Current Handoff

最終更新: 2026-07-22
最終担当: Claude Code
タスクID: ADD-MIRICANVAS-ARTICLE-20260722
状態: 両サイト公開・検証完了、公開分commit・push待ち

## 目的

新規アフィリエイト記事「MiriCanvas」を2サイトへ作成・公開する。

- スラグ: `miricanvas-ai-presentation-guide-2026`（両テーブル共通）
- `blog_posts`（moveworthapp.com）: category=money, is_promotion=true
- `study_blog_posts`（study.moveworthapp.com）: category=guide（is_promotionカラムなし）
- 言語: JA/EN/ZH（3言語フル執筆）
- アフィリエイトリンク: href=`https://abr.ge/0xaw24`、表示テキスト「MiriCanvas公式サイトはこちら」（変更禁止）

## 経緯（要約）

1. draft作成: 両テーブルへ`is_published:false`でinsert（`scripts/post-miricanvas-article.ts`）。JA/EN/ZH全言語、作成日「2026年7月22日」記載
2. 発見事項: study_blog_postsに`is_promotion`カラムなし（BL-20260722-04としてbacklog化）／study側レンダラーは`<!-- html -->`ブロック非対応のためMarkdownリンク形式を使用（blog_posts側は生HTML+htmlマーカー）
3. commit（`acfeb83`）: CLAUDE.md(PROTECTED_SLUGS追加)・post-miricanvas-article.ts・BACKLOG.md・CURRENT_HANDOFF.md・RECENT_ACTIVITY.md
4. 内容改善: タイトル変更＋「活用シーン別の使い方」「よくある質問(FAQ)」追加（`scripts/update-miricanvas-content.ts`、両テーブルtitle/contentのみターゲットパッチ）
5. commit（`db870ec`）・push
6. 公開: 両テーブルの`is_published`をtrueへ切替（`scripts/publish-miricanvas-article.ts`、再生成なし）

## 直近の公開結果

- `blog_posts`: is_published=true、content/title不変、対象外97件完全不変を確認
- `study_blog_posts`: is_published=true、content/title不変、対象外114件完全不変を確認
- HTTP確認: `https://www.moveworthapp.com/blog/miricanvas-ai-presentation-guide-2026` → 200、`https://study.moveworthapp.com/blog/miricanvas-ai-presentation-guide-2026` → 200
- `inspect-all-blog-posts.ts`: blog_posts 98件（公開95・非公開3）、study_blog_posts 115件（公開108）、構造不正0件

## 変更した主要ファイル

- `CLAUDE.md`（PROTECTED_SLUGS追加、commit済み）
- `scripts/post-miricanvas-article.ts`（commit済み）
- `scripts/update-miricanvas-content.ts`（新規、未commit）
- `scripts/publish-miricanvas-article.ts`（新規、未commit）
- `docs/BACKLOG.md`（BL-20260722-04追加、commit済み）
- DB: `blog_posts`・`study_blog_posts`各1件、is_published:true

## Git状態・未コミット変更

- `db870ec`までpush済み
- 今回の公開作業に伴う`scripts/update-miricanvas-content.ts`・`scripts/publish-miricanvas-article.ts`は未commit
- 既存の対象外差分（tsbuildinfo、未追跡一時スクリプト群等）は継続・不変

## 実行済みの検証

- 型チェック（全新規スクリプト）: エラー0件
- `assertBlogPayload`: draft作成時・内容改善時とも両テーブル通過
- アフィリエイトhref出現回数不変確認（内容改善前後・公開前後）
- 公開前後で対象外レコード（blog_posts 97件・study_blog_posts 114件）の完全不変を機械比較
- HTTP 200確認（両サイト）
- `inspect-all-blog-posts.ts`: 異常0件

## 未解決事項

- なし（本タスク範囲内）
- `BL-20260722-04`（study_blog_postsへのis_promotionカラム追加）はbacklogとして継続

## 次に行う作業

1. `scripts/update-miricanvas-content.ts`・`scripts/publish-miricanvas-article.ts`・handoff類を`feat: publish miricanvas affiliate article on both sites`でcommit
2. push
3. ユーザーへ公開URL・確認結果を報告

## 禁止事項・注意事項

- アフィリエイトリンクのhref・表示テキストは変更・削除禁止
- push はユーザー明示許可なしに実行しない（今回は指示済み）

## ユーザー判断が必要な事項

- なし（本タスクは指示通り完了）
