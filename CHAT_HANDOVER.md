# MoveWorth チャット引き継ぎファイル

最終更新: 2026-03-17

## プロジェクト概要
- **サービス名**: MoveWorth（海外移住・留学費用シミュレーター）
- **メインサイト**: https://www.moveworthapp.com
- **留学サイト**: https://study.moveworthapp.com
- **GitHub**: https://github.com/20010208/moveworth
- **技術スタック**: Next.js 15 + TypeScript + Tailwind CSS + Supabase + Stripe
- **デプロイ**: Vercel
- **サブドメインルーティング**: middleware.ts（study.moveworthapp.com → /study-site/*）

---

## プラン設定

| プラン | 価格 | AIレポート上限 |
|---|---|---|
| Free | $0 | なし |
| Pro | $8/月 | 月5回 |
| Premium | $15/月 | 月10回 |

- AIレポート使用記録テーブル: Supabase `ai_report_usage`（user_id, created_at）
- 制限ロジック: `src/app/api/generate-report/route.ts` の `PLAN_LIMITS`

---

## Vercel 環境変数（設定済み）

| 変数名 | 備考 |
|---|---|
| NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY | pk_live_... |
| STRIPE_SECRET_KEY | sk_live_... |
| STRIPE_WEBHOOK_SECRET | whsec_...（本番Webhook） |
| STRIPE_PRO_PRICE_ID | 本番ProプランのPrice ID |
| STRIPE_PREMIUM_PRICE_ID | 本番PremiumプランのPrice ID |
| NEXT_PUBLIC_PAYMENT_ENABLED | true |
| NEXT_PUBLIC_ADSENSE_CLIENT | ca-pub-5849589587373412 |
| NEXT_PUBLIC_SUPABASE_URL | Supabase URL |
| SUPABASE_SERVICE_ROLE_KEY | Supabase Service Role Key |

---

## Stripe Webhook
- URL: `https://www.moveworthapp.com/api/webhook/stripe`
- 監視イベント:
  - `checkout.session.completed` → ユーザープランをpro/premiumに更新
  - `customer.subscription.updated` → プラン変更時に更新
  - `customer.subscription.deleted` → プランをfreeに戻す

---

## 主要ファイル

| ファイル | 内容 |
|---|---|
| `src/app/layout.tsx` | AdSenseスクリプト、OGPメタデータ |
| `src/app/page.tsx` | ホーム画面（動画背景ヒーロー） |
| `src/app/study-site/page.tsx` | 留学サイトトップページ |
| `src/app/subscribe/page.tsx` | 料金プランページ |
| `src/app/api/webhook/stripe/route.ts` | Stripe Webhook |
| `src/app/api/create-checkout-session/route.ts` | Stripe決済セッション作成 |
| `src/app/api/generate-report/route.ts` | AIレポート生成API（Pro/Premium月次制限付き） |
| `src/data/blog-posts.ts` | メインサイトのブログ記事データ（41カ国ビザガイド等） |
| `src/data/study-blog-posts.ts` | 留学サイトのブログ記事データ（42記事） |
| `src/components/ads/sidebar-ad.tsx` | サイドバー広告コンポーネント（現在非表示） |
| `src/lib/exchange-rate.ts` | 為替レート取得（open.er-api.com、160通貨対応） |
| `next.config.ts` | セキュリティヘッダー・CSP・301リダイレクト設定 |
| `public/ads.txt` | AdSense認証ファイル |
| `public/og-image.jpg` | OGP画像（1200x630） |
| `public/globe.mp4` | ヒーロー背景動画 |

---

## 完了済みタスク

| タスク | 状態 |
|---|---|
| セキュリティヘッダー設定（CSP, X-Frame-Options等） | ✅ |
| OGP画像追加（/public/og-image.jpg, 1200x630） | ✅ |
| ヒーロー全体背景に globe.mp4 動画 + 暗いオーバーレイ | ✅ |
| Stripe本番モード審査通過 | ✅ |
| Stripe Webhook設定 | ✅ |
| NEXT_PUBLIC_PAYMENT_ENABLED=true（Vercel環境変数） | ✅ |
| 301リダイレクト（non-www → www）next.config.ts | ✅ |
| クッキー同意バナー実装（localStorage保存） | ✅ |
| NordVPNアフィリエイト記事追加 | ✅ |
| AIレポート生成に月次制限追加（Pro:5回/月、Premium:10回/月） | ✅ |
| 料金改定（Pro: $8/月、Premium: $15/月）・Stripe価格更新済み | ✅ |
| Google AdSense申請・コード設置（ca-pub-5849589587373412） | ✅（審査中） |
| Xアカウント作成（@MoveWorthApp） | ✅ |
| X自動投稿ワークフロー削除（X API有料のため断念） | ✅ |
| ブログ記事追加（41カ国分のビザ・就労許可ガイド） | ✅ |
| 留学サイトにブログ機能追加（42記事） | ✅ |
| 両サイトのブログ記事ファクトチェック＆修正（2026-03-17） | ✅ |

---

## Google AdSense
- Publisher ID: ca-pub-5849589587373412
- root layout.tsx にスクリプト設置済み（全ページ適用）
- 審査は複数回落ちており、再申請中

### 審査通過後の手順
1. AdSenseダッシュボードで広告ユニットを作成してスロットIDを取得
2. `src/app/simulate/page.tsx` の SidebarAd コメントアウトを外す
3. `slot="LEFT_AD_SLOT"` と `slot="RIGHT_AD_SLOT"` を実際のスロットIDに変更
4. git commit & push

---

## SEO現状（2026年3月17日時点）
- Health Score: 97（Ahrefs）
- DR: 0（まだ新しいサイト）
- 検索クリック数: 4（3ヶ月）
- インプレッション: 67
- 平均順位: 16.8位
- 月間ユーザー: 約49人（ほぼDirect流入、Organicはまだ少ない）
- インデックス開始: 2026年3月8日頃

---

## 残タスク

| タスク | 備考 |
|---|---|
| AdSense審査通過待ち | 通過後にadsense.tsxのIDを修正 |
| SEO流入増加待ち | 3〜6ヶ月スパン |
| X手動投稿での認知拡大 | @MoveWorthApp |
| 留学ブログの3言語対応 | 将来的に |
| ユーザー登録数増加施策 | 現状ほぼゼロ |

---

## Claudeへの指示
- コードの変更・修正が完了したら、毎回 `git commit` & `git push` を行うこと
- `src/data/housing-costs.ts` に国を追加・修正するときは、その国の「外国人が多く住むエリア」の相場を使うこと（全国平均NG）
  - 例: JP→東京（新宿/渋谷/港区）、MY→KL（Mont Kiara/Bangsar）、TH→バンコク（スクンビット）、US→NY/LA/SF など
