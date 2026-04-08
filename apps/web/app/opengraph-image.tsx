import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "uiUniverse — AI-Native Motion UI Components for React";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "#0a0a0a",
        fontFamily: "system-ui, sans-serif",
        position: "relative",
      }}
    >
      {/* Accent border top */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: "#ee502c",
        }}
      />

      {/* Subtle grid pattern */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(238,80,44,0.08) 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 24,
          position: "relative",
        }}
      >
        {/* Logo text */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            color: "white",
            letterSpacing: "-0.02em",
            display: "flex",
            alignItems: "center",
          }}
        >
          <span>ui</span>
          <span style={{ color: "#ee502c" }}>U</span>
          <span>niverse</span>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 28,
            color: "#a0a0a0",
            textAlign: "center",
            maxWidth: 700,
            lineHeight: 1.4,
          }}
        >
          AI-Native Motion UI Components for React & Next.js
        </div>

        {/* Stats row */}
        <div
          style={{
            display: "flex",
            gap: 48,
            marginTop: 16,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
            }}
          >
            <span style={{ fontSize: 36, fontWeight: 700, color: "#ee502c" }}>25+</span>
            <span style={{ fontSize: 14, color: "#666" }}>Components</span>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
            }}
          >
            <span style={{ fontSize: 36, fontWeight: 700, color: "#ee502c" }}>5.5x</span>
            <span style={{ fontSize: 14, color: "#666" }}>Token Savings</span>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
            }}
          >
            <span style={{ fontSize: 36, fontWeight: 700, color: "#ee502c" }}>100%</span>
            <span style={{ fontSize: 14, color: "#666" }}>TypeScript</span>
          </div>
        </div>
      </div>

      {/* URL bottom */}
      <div
        style={{
          position: "absolute",
          bottom: 32,
          fontSize: 18,
          color: "#555",
        }}
      >
        uiuniverse.dev
      </div>
    </div>,
    { ...size },
  );
}
