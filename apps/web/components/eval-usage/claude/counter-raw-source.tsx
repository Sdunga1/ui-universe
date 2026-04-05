// @ts-nocheck
import React from "react";
import Counter from "../../fixtures/Counter";

export default function Example() {
  const [value, setValue] = React.useState(1234.56);
  const [isAnimating, setIsAnimating] = React.useState(false);

  const animateToRandomValue = () => {
    if (isAnimating) return;

    setIsAnimating(true);
    const newValue = Math.random() * 9999 + Math.random() * 0.99;
    setValue(Math.round(newValue * 100) / 100);

    // Reset animation state after a delay
    setTimeout(() => setIsAnimating(false), 1000);
  };

  return (
    <div
      style={{
        padding: "2rem",
        fontFamily: "system-ui, -apple-system, sans-serif",
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "2rem",
      }}
    >
      <h1 style={{ margin: 0, color: "#333" }}>Counter Component Examples</h1>

      {/* Basic counter */}
      <div style={{ textAlign: "center" }}>
        <h2 style={{ marginBottom: "1rem", color: "#666" }}>Basic Counter</h2>
        <Counter value={value} />
      </div>

      {/* Styled counter */}
      <div style={{ textAlign: "center" }}>
        <h2 style={{ marginBottom: "1rem", color: "#666" }}>Styled Counter</h2>
        <Counter
          value={value}
          fontSize={80}
          containerStyle={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            padding: "1rem",
            borderRadius: "12px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
          }}
          textColor="white"
          fontWeight="bold"
          gap={12}
          gradientFrom="rgba(255,255,255,0.2)"
          gradientTo="transparent"
        />
      </div>

      {/* Compact counter */}
      <div style={{ textAlign: "center" }}>
        <h2 style={{ marginBottom: "1rem", color: "#666" }}>Compact Counter</h2>
        <Counter
          value={Math.round(value)}
          fontSize={40}
          gap={4}
          horizontalPadding={12}
          containerStyle={{
            backgroundColor: "#333",
            borderRadius: "8px",
          }}
          textColor="#00ff88"
          fontWeight="600"
          gradientHeight={8}
        />
      </div>

      {/* Large display counter */}
      <div style={{ textAlign: "center" }}>
        <h2 style={{ marginBottom: "1rem", color: "#666" }}>Large Display</h2>
        <Counter
          value={value}
          fontSize={120}
          padding={20}
          gap={16}
          horizontalPadding={24}
          containerStyle={{
            backgroundColor: "#000",
            border: "2px solid #333",
          }}
          textColor="#ff6b6b"
          fontWeight="900"
          borderRadius={16}
          gradientHeight={24}
          gradientFrom="rgba(0,0,0,0.8)"
        />
      </div>

      {/* Control button */}
      <button
        onClick={animateToRandomValue}
        disabled={isAnimating}
        style={{
          padding: "12px 24px",
          fontSize: "16px",
          fontWeight: "600",
          backgroundColor: isAnimating ? "#ccc" : "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: isAnimating ? "not-allowed" : "pointer",
          transition: "all 0.2s ease",
        }}
      >
        {isAnimating ? "Animating..." : "Generate Random Value"}
      </button>

      {/* Current value display */}
      <div
        style={{
          textAlign: "center",
          color: "#666",
          fontSize: "14px",
          fontFamily: "monospace",
        }}
      >
        Current value: {value.toFixed(2)}
      </div>
    </div>
  );
}
