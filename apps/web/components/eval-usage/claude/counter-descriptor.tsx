// @ts-nocheck
import { useEffect, useState } from "react";
import Counter from "../../fixtures/Counter";

export default function Example() {
  const [value, setValue] = useState(0);
  const [targetValue, setTargetValue] = useState(1234);

  // Animate to target value on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setValue(targetValue);
    }, 500);
    return () => clearTimeout(timer);
  }, [targetValue]);

  const handleNewValue = () => {
    const newValue = Math.floor(Math.random() * 9999) + 1;
    setTargetValue(newValue);
    setValue(newValue);
  };

  return (
    <div
      style={{
        padding: "40px",
        backgroundColor: "#1a1a1a",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <h1 style={{ color: "white", marginBottom: "40px", textAlign: "center" }}>
        Animated Counter Examples
      </h1>

      {/* Main counter */}
      <div style={{ marginBottom: "40px" }}>
        <Counter
          value={value}
          fontSize={80}
          textColor="white"
          fontWeight={700}
          gradientFrom="#1a1a1a"
          borderRadius={8}
          horizontalPadding={16}
        />
      </div>

      {/* Smaller counter with custom styling */}
      <div style={{ marginBottom: "40px" }}>
        <Counter
          value={Math.floor(value / 10)}
          fontSize={40}
          textColor="#60a5fa"
          fontWeight={500}
          gap={6}
          gradientFrom="#1a1a1a"
          borderRadius={6}
          horizontalPadding={12}
        />
      </div>

      {/* Counter with specific places */}
      <div style={{ marginBottom: "40px" }}>
        <Counter
          value={42}
          places={[100, 10, 1]}
          fontSize={60}
          textColor="#34d399"
          fontWeight={600}
          gap={10}
          gradientFrom="#1a1a1a"
        />
      </div>

      <button
        onClick={handleNewValue}
        style={{
          padding: "12px 24px",
          fontSize: "16px",
          backgroundColor: "#3b82f6",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontWeight: "500",
        }}
      >
        Generate New Value
      </button>

      <p style={{ color: "#9ca3af", marginTop: "20px", textAlign: "center" }}>
        Click the button to see the counter animate to a new random value
      </p>
    </div>
  );
}
