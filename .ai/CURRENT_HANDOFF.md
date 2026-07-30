# Current Handoff

最終更新: 2026-07-30
最終担当: Claude Code
タスクID: ADD-METS-VIRTUAL-OFFICE-ARTICLE-20260730
状態: 画像追加・公開・検証完了。commit・push未実施（ユーザー承認待ち）

## 画像追加・公開（2026-07-30 5回目）

`scripts/add-images-and-publish-mets-virtual-office.ts`（新規）で実施:
1. Storage上の既存画像3枚（`Mets-Virtual-Office/mets-features.png`・`mets-plan-pricing.png`・`mets-plan-comparison.png`）を`prepareCompressedThumbnail`で圧縮（325KB→71KB / 393KB→88KB / 201KB→72KB）
2. 全言語のcontentへ指定位置に画像を挿入（features: 導入部アフィリエイトリンク直後＝「METSバーチャルオフィスとは」系見出し直前／pricing・comparison: 「プラン別の特徴と料金」系見出し直後、この順）
3. `is_published`を`false→true`へターゲットパッチ（再生成なし）で公開
4. HTTP 200確認・対象外blog_posts 99件の完全不変を機械比較で確認

**注**: thumbnail（OGP）設定は今回のユーザー指示に含まれていなかったため未実施（前の中断されたメッセージには含まれていたが、今回の実行版指示には無かったため対象外とした）。ユーザー確認が必要な場合はBACKLOG化または追加指示を待つ。

検証: is_published/title/description/category/is_promotion/locales/pinned/thumbnail不変（content挿入時点）、公開後content/title不変、`inspect-all-blog-posts.ts`異常0件（100件、公開97）、`check-published-slugs-http.ts`全97件200

## 追加修正（2026-07-30 4回目）

`scripts/update-mets-virtual-office-content-v3.ts`で以下2点を反映（アフィリエイトhrefは変更していない）:
1. 郵便表現の強化：「受取不可の場合があります」→「受取できません」（全言語、断定表現へ強化）
2. EN/ZHのCTAリンク表示テキストを翻訳：EN "Click here for the METS Virtual Office official website" / ZH "点击这里前往METS虚拟办公室官方网站"（JAは「都心格安のバーチャルオフィス【METSバーチャルオフィス】」のまま維持）

検証: is_published/title/description/category/is_promotion/locales/pinned不変確認、アフィリエイトhref（全言語2箇所）・トラッキングピクセル（全言語1箇所）は変更なしを確認、`inspect-all-blog-posts.ts`異常0件

## 追加修正（2026-07-30 3回目）

ユーザー指摘の3点＋軽微問題を対象限定パッチで反映（アフィリエイトリンクは変更していない）:
1. JA本文をタグ除去後6000字以上に補完（5186字→6160字）：「海外在住者がバーチャルオフィスを選ぶ際のポイント」セクションを新規追加（EN/ZHも同様に追加）
2. 必要書類（契約者本人確認書類・代理人本人確認書類・委任状・法人契約時の履歴事項全部証明書）を「申し込み方法」セクションとFAQ Q1の両方に全言語で追記
3. 郵便物の誤認表現を修正：「安全かつ確実に管理」「安心して預けることができます」等の断定表現を、「本人限定受取郵便・特別送達・裁判文書等は受取不可の場合がある」旨の正確な表現へ修正
4. 軽微問題：「ネットショップラン」→「ネットショッププラン」（正式名称）に修正、PR表記に「本リンク経由での申込みにより当サイトに報酬が発生する場合があります」を冒頭・末尾の両方に追記

検証: 全ての文字列置換を出現回数アサーション付きで実施（想定外の箇所は例外で検出される設計）。is_published/title/description/category/is_promotion/locales/pinned不変確認、アフィリエイトhref・トラッキングピクセルは変更なしを確認、`inspect-all-blog-posts.ts`異常0件

## 追加修正（2026-07-30 2回目）

ユーザー指摘の7点を`scripts/update-mets-virtual-office-content.ts`（新規）で反映:
1. アフィリエイトリンクをA8計測リンクへ差し替え（新href・新ラベル、全言語2箇所ずつ）、トラッキングピクセルを各言語末尾に1回追加
2. 日本在住代理人条件を導入部・申し込み方法・FAQ Q1の3箇所に追記（全言語）
3. ライトプランの説明を「住所だけ」に修正、郵便受取・法人登記・転送不可を明記
4. 銀行口座維持・サービス継続利用の断定表現を「金融機関/事業者の規約・審査による」旨の表現へ修正
5. タイトルを中立表現に変更
6. 「会員継続率98%超」→「公式サイトでは2018〜2022年の自社データとして約98%と紹介」に変更（description含む）
7. 「注意事項・免責」セクションを追加し、JA本文をタグ除去後5000字以上に補完（5186字）

検証: is_published/category/is_promotion/locales/pinned不変確認、新href全言語2箇所以上・旧href残存0・トラッキングピクセル1回・代理人記載3箇所以上を機械確認、`inspect-all-blog-posts.ts`異常0件

## 目的

新規アフィリエイト記事「METSバーチャルオフィス」を`blog_posts`へ作成する。

- スラグ: `mets-virtual-office-overseas-japanese-guide-2026`
- カテゴリ: money、is_promotion: true
- 言語: JA（5000字以上）/EN/ZH
- `is_published: false`（draft保存のみ）
- アフィリエイトリンク: `<a href="https://vo-metsoffice.jp/" rel="nofollow">METSバーチャルオフィス公式サイトはこちら</a>`（href・表示テキスト変更禁止）
- リスティングNGワード対応: 「METSオフィス」という略称は使わず、常に「METSバーチャルオフィス」と表記する

## 事前確認

- 同slugの既存レコードなしを確認済み
- `CLAUDE.md`セクション7のPROTECTED_SLUGSに本スラグを追加済み（未commit）
- アフィリエイトリンクは`<!-- html -->`ブロックで囲んで実装（過去のsuika-vpn/miricanvasタスクで確立した、blog-post-content.tsxのレンダラー仕様に合わせるための必須対応）

## 本タスクでの変更予定

- `scripts/post-mets-virtual-office-article.ts`（新規）でdraft insert
- `blog_posts`: slug, category:money, published_at, reading_minutes, thumbnail:null, title/description/content(ja/en/zh), locales:["ja","en","zh"], pinned:false, is_published:false, is_promotion:true
- 本文に作成日「2026年7月30日」を目視確認できる形で記載
- assertBlogPayload通過確認、アフィリエイトhref出現回数（本文中+末尾で2箇所以上）確認
- 禁止パターン・example.com混入チェック

## 変更した主要ファイル

- `CLAUDE.md`（セクション7 PROTECTED_SLUGS追加、未commit）
- `.ai/CURRENT_HANDOFF.md`
- （予定）`scripts/post-mets-virtual-office-article.ts`（新規）
- DB（予定）: `blog_posts`に1件、is_published:false

## Git状態

- `CLAUDE.md`: 本タスクでの追加（未commit）
- 既存の対象外差分（tsbuildinfo、未追跡一時スクリプト群等）は継続・不変

## 実行済みの検証

1. `npx tsc --project tsconfig.scripts.json --noEmit`: エラー0件
2. `npx tsx scripts/post-mets-virtual-office-article.ts`: assertBlogPayload通過・insert成功
   - JA 5015字 / EN 10367字 / ZH 3693字（JA5000字要件を満たす。初回4488字だったため「こんな海外在住者におすすめ」セクションを追加して拡充）
3. アフィリエイトhref出現回数（全言語2回以上）、禁止パターン・example.com混入0件、NG略称「METSオフィス」混入0件、作成日「2026年7月30日」記載を確認
4. `inspect-all-blog-posts.ts`: blog_posts 100件（公開96・非公開4）構造不正0件
5. DB再取得で `category:money` / `is_published:false` / `is_promotion:true` / `locales:[ja,en,zh]` を確認

## 未解決事項

- なし（本タスク範囲内）

## 次に行う作業

1. JA本文をユーザーにレビュー提示済み
2. ユーザー承認後、公開判断（このセッションでは公開しない）

## 禁止事項・注意事項

- アフィリエイトリンクのhref・表示テキストは変更・削除禁止
- 「METSオフィス」という略称は使用しない（「METSバーチャルオフィス」のみ使用）
- 承認前に is_published を true にしない

## ユーザー判断が必要な事項

- JA本文レビュー・承認
- 公開可否・タイミング
