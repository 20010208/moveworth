# Current Handoff

最終更新: 2026-07-22
最終担当: Claude Code
タスクID: SWAP-SUIKA-VPN-AFFILIATE-LINK-20260722
状態: 差し替え・検証完了。commit・push未実施（ユーザー指示待ち）

## 目的

`suika-vpn-overseas-japanese-streaming-guide-2026`（PROTECTED_SLUGS対象）のアフィリエイトリンクを、ユーザーの明示的許可によりA8正規計測リンクへ差し替える。

## 実施内容

- 旧アンカー `<a href="https://www.suika-v2.com/?im=tu6" ...>スイカVPN公式サイトはこちら</a>` を、新アンカー `<a href="https://px.a8.net/svt/ejp?a8mat=4B82L1+AINPIQ+4R3G+61C2Q" rel="nofollow">海外から日本の動画が見れる【スイカVPN】</a>` へJA/EN/ZH各2箇所（計6箇所）を置換
- 各言語本文末尾にトラッキングピクセル `<img border="0" width="1" height="1" src="https://www14.a8.net/0.gif?a8mat=4B82L1+AINPIQ+4R3G+61C2Q" alt="">` を1回追加（`<!-- html -->`マーカーで囲み、実際にレンダリングされるようにした）
- 置換は「beforeテキストに対する文字列置換＋末尾追加」で計算した期待値とDB更新後の実値を完全一致比較する方式で実施し、意図しない本文変化がないことを構造的に担保

## 変更した主要ファイル

- `scripts/swap-suika-vpn-affiliate-link.ts`（新規、未commit）
- DB: `blog_posts` 1件（`suika-vpn-overseas-japanese-streaming-guide-2026`）の`content`列のみ

## Git状態

- 前回commit（`d28558c`）はpush済み
- 今回の`scripts/swap-suika-vpn-affiliate-link.ts`は未commit（ユーザー指示待ち）
- 既存の対象外差分（tsbuildinfo、未追跡一時スクリプト群等）は継続・不変

## 実行済みの検証

1. `npx tsc --project tsconfig.scripts.json --noEmit`: エラー0件
2. `assertBlogPayload`: 通過
3. `is_published`・`title`・`description`不変を機械比較
4. 新アンカー出現回数（全言語各2回）・旧href残存なし・トラッキングピクセル出現回数（全言語各1回）を確認
5. `inspect-all-blog-posts.ts`: blog_posts 98件（公開95）構造不正0件
6. HTTP 200確認（対象記事）

## 未解決事項

- なし（本タスク範囲内）

## 次に行う作業

1. ユーザーへ変更概要（href/src抽出結果含む）を報告
2. ユーザー指示によりcommit・push

## 禁止事項・注意事項

- is_publishedは変更していない
- push はユーザー明示許可なしに実行しない
- 今回の変更は「ユーザー明示許可によるPROTECTED_SLUGS例外対応」であり、他のPROTECTED_SLUGS記事への同様の変更を許可するものではない

## ユーザー判断が必要な事項

- commit対象ファイル・メッセージの指定、push可否
