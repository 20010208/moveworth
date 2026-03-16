import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "MoveWorth - 海外移住 資産シミュレーター";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* 背景の装飾円 */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            right: "-100px",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-80px",
            left: "-80px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)",
          }}
        />

        {/* ロゴエリア */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              border: "2px solid rgba(99,102,241,0.6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "28px",
            }}
          >
            🌏
          </div>
          <span
            style={{
              fontSize: "36px",
              fontWeight: "700",
              color: "#a5b4fc",
              letterSpacing: "-0.5px",
            }}
          >
            MoveWorth
          </span>
        </div>

        {/* メインタイトル */}
        <div
          style={{
            fontSize: "52px",
            fontWeight: "800",
            color: "#ffffff",
            textAlign: "center",
            lineHeight: "1.2",
            marginBottom: "20px",
            letterSpacing: "-1px",
          }}
        >
          海外移住したら
          <br />
          資産はどうなる？
        </div>

        {/* サブテキスト */}
        <div
          style={{
            fontSize: "22px",
            color: "#94a3b8",
            textAlign: "center",
            marginBottom: "40px",
          }}
        >
          40カ国対応・無料シミュレーター
        </div>

        {/* バッジ */}
        <div
          style={{
            display: "flex",
            gap: "12px",
          }}
        >
          {["🌍 40カ国対応", "💰 費用計算", "📊 資産シミュレーション"].map((text) => (
            <div
              key={text}
              style={{
                background: "rgba(99,102,241,0.15)",
                border: "1px solid rgba(99,102,241,0.3)",
                borderRadius: "100px",
                padding: "8px 20px",
                fontSize: "16px",
                color: "#c7d2fe",
              }}
            >
              {text}
            </div>
          ))}
        </div>

        {/* ドメイン */}
        <div
          style={{
            position: "absolute",
            bottom: "28px",
            right: "40px",
            fontSize: "16px",
            color: "rgba(148,163,184,0.6)",
          }}
        >
          moveworthapp.com
        </div>
      </div>
    ),
    { ...size }
  );
}
