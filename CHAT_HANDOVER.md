# MoveWorth チャット引き継ぎファイル

最終更新: 2026-02-27（午後追記）

## プロジェクト概要
- **サービス名**: MoveWorth（海外移住財務シミュレーター）
- **URL**: https://moveworth-alpha.vercel.app
- **GitHub**: https://github.com/20010208/moveworth
- **技術スタック**: Next.js 15 + TypeScript + Tailwind CSS + Supabase + Stripe

---

## 完了済みタスク

| タスク | 状態 |
|---|---|
| セキュリティヘッダー設定（CSP, X-Frame-Options等） | 完了 |
| OGP画像追加（/public/og-image.jpg, 1200x630, 46KB） | 完了 |
| ヒーロー全体背景に globe.mp4 動画 + 暗いオーバーレイ | 完了 |
| 有料会員/無料会員でCTAボタン文言を変更 | 完了 |
| ブログ記事追加（Free/Pro/Premium比較 ja/en/zh） | 完了 |
| Google AdSense申請・コード設置（ca-pub-5849589587373412） | 完了（審査中） |
| ads.txt 設置（/public/ads.txt） | 完了 |
| サイドバー広告を審査通過まで非表示（コメントアウト） | 完了 |
| Stripe本番モード審査通過 | 完了 |
| Stripe Webhook設定 | 完了 |
| NEXT_PUBLIC_PAYMENT_ENABLED=true（Vercel環境変数） | 完了 |
| 為替レートAPI変更（Frankfurter → open.er-api.com、MYR対応） | 完了 |
| Google Search Console サイトマップ送信（36ページ） | 完了 |
| プライバシーポリシーにAdSense・Cookie・アフィリエイト開示追加 | 完了 |
| クッキー同意バナー実装（localStorage保存） | 完了 |
| NordVPNアフィリエイト記事追加（A8.net・Wチャンスボーナス申請済み） | 完了 |
| AIレポート生成に月次制限追加（Pro:5回/月、Premium:10回/月） | 完了 |
| Supabase ai_report_usage テーブル作成済み | 完了 |
| 料金改定（Pro: $8/月、Premium: $15/月）・Stripe価格更新済み | 完了 |
| AIレポート機能をProユーザーにも開放 | 完了 |

---

## 待機中タスク

| タスク | 状態 | 備考 |
|---|---|---|
| Google AdSense審査結果 | 審査中 | 数日〜2週間。vercel.appドメインのため却下リスクあり |
| Google Search Console インデックス反映 | クロール待ち | 3月上旬頃に反映予定。現在1ページのみインデックス済み、14ページがクロール待ち |

---

## Google Search Console 現状（2026-02-27時点）

- **登録済み**: 1ページ
- **未登録（クロール待ち）**: 14ページ（「検出 - インデックス未登録」状態）
- **サイトマップ**: 送信済み（2/21）、成功、36ページ検出
- **検索クリック数**: 0（まだ検索結果に表示されていない）
- **対応**: 3月中旬まで待つ。変化なければURL検査で「インデックス登録をリクエスト」を押す

---

## 将来タスク

| タスク | 備考 |
|---|---|
| カスタムドメイン購入 | AdSense却下後に検討。SEOにも有利。.comか.appがおすすめ |
| X（Twitter）自動投稿システム | ブログ投稿時に自動でXに投稿。GitHub Actions + X API（無料プランで月1500件まで） |
| AdSense審査通過後：広告スロットID設定 | simulate/page.tsx の SidebarAd コメントを外してスロットIDを設定 |
| generateMetadata多言語対応 | blog/[slug]/page.tsx のmetadataが日本語のみ |
| ブログ投稿継続 | 週2〜3投稿がSEO的に理想。新記事追加後はSearch ConsoleでURLリクエストを押す |
| NordVPN Wチャンスボーナス申請 | 申請済み（2026-02-27）。期限4/30。+2,000円 |
| AdSense審査通過後：広告スロットID設定 | simulate/page.tsx の SidebarAd コメントを外してスロットIDを設定 |

---

## Vercel 環境変数（設定済み）

| 変数名 | 備考 |
|---|---|
| NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY | pk_live_... |
| STRIPE_SECRET_KEY | sk_live_... |
| STRIPE_WEBHOOK_SECRET | whsec_... （本番Webhook） |
| STRIPE_PRO_PRICE_ID | 本番ProプランのPrice ID |
| STRIPE_PREMIUM_PRICE_ID | 本番PremiumプランのPrice ID |
| NEXT_PUBLIC_PAYMENT_ENABLED | true |
| NEXT_PUBLIC_ADSENSE_CLIENT | ca-pub-5849589587373412 |
| NEXT_PUBLIC_SUPABASE_URL | Supabase URL |
| SUPABASE_SERVICE_ROLE_KEY | Supabase Service Role Key |

---

## 主要ファイル

| ファイル | 内容 |
|---|---|
| src/app/layout.tsx | AdSenseスクリプト、OGPメタデータ |
| src/app/page.tsx | ホーム画面（動画背景ヒーロー） |
| src/app/subscribe/page.tsx | 料金プランページ（NEXT_PUBLIC_PAYMENT_ENABLED制御） |
| src/app/api/webhook/stripe/route.ts | Stripe Webhook（checkout.completed / subscription.updated / subscription.deleted） |
| src/app/api/create-checkout-session/route.ts | Stripe決済セッション作成 |
| src/lib/exchange-rate.ts | 為替レート取得（open.er-api.com、MYR等160通貨対応） |
| src/data/blog-posts.ts | ブログ記事データ（32記事、NordVPN記事含む） |
| src/components/ads/sidebar-ad.tsx | サイドバー広告コンポーネント（現在非表示） |
| next.config.ts | セキュリティヘッダー・CSP設定 |
| public/ads.txt | AdSense認証ファイル |
| public/og-image.jpg | OGP画像（1200x630） |
| public/globe.mp4 | ヒーロー背景動画 |
| public/images/ | ブログ記事用画像（nordvpn-cafe.jpg.jpg 等） |
| src/app/privacy/page.tsx | プライバシーポリシー（URL自動リンク化） |
| src/components/ui/cookie-banner.tsx | クッキー同意バナー |
| src/app/api/generate-report/route.ts | AIレポート生成API（Pro/Premium月次制限付き） |

---

## プラン設定（2026-02-27時点）

| プラン | 価格 | AIレポート上限 |
|---|---|---|
| Free | $0 | なし |
| Pro | $8/月 | 月5回 |
| Premium | $15/月 | 月10回 |

- AIレポート使用記録テーブル: Supabase `ai_report_usage`（user_id, created_at）
- 制限ロジック: `src/app/api/generate-report/route.ts` の `PLAN_LIMITS`

## AdSense 審査通過後の手順
1. AdSenseダッシュボードで広告ユニットを作成してスロットIDを取得
2. `src/app/simulate/page.tsx` の SidebarAd コメントアウトを外す
3. `slot="LEFT_AD_SLOT"` と `slot="RIGHT_AD_SLOT"` を実際のスロットIDに変更
4. git push

## Stripe Webhook エンドポイント
- URL: `https://moveworth-alpha.vercel.app/api/webhook/stripe`
- 監視イベント:
  - `checkout.session.completed` → ユーザープランをpro/premiumに更新
  - `customer.subscription.updated` → プラン変更時に更新
  - `customer.subscription.deleted` → プランをfreeに戻す

---

## SEO状況
- Google Analytics: 95ユーザー（2/17〜2/26）、平均滞在時間7分、3.92ページ/セッション
- 検索経由のトラフィック: まだ0（インデックス待ち）
- ブログ投稿推奨ペース: 週2〜3回
- 新記事追加後はSearch ConsoleのURL検査で「インデックス登録をリクエスト」を押すと早く反映される
