// @ts-nocheck
import type React from "react";
import { useEffect, useState } from "react";
import Counter from "../../fixtures/Counter"; // Assuming Counter.tsx is in the same directory

const Example: React.FC = () => {
  const [currentValue, setCurrentValue] = useState(0);

  // Use useEffect to update the value periodically, demonstrating animation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentValue((prev) => {
        const nextValue = prev + 0.01;
        // Reset to 0 when it approaches 10 to create a continuous loop
        return nextValue >= 10 ? 0 : Number.parseFloat(nextValue.toFixed(2));
      });
    }, 100); // Update every 100 milliseconds

    return () => clearInterval(interval); // Clean up the interval on unmount
  }, []);

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#282c34", // Dark background to make default gradients visible
        color: "#f0f0f0",
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      <h1 style={{ fontSize: "3em", marginBottom: "40px", textAlign: "center" }}>
        Animated Counter Demonstration
      </h1>

      <div
        style={{
          marginBottom: "60px",
          border: "1px solid #444",
          borderRadius: "12px",
          padding: "20px",
          backgroundColor: "#3a3f47",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        }}
      >
        <p style={{ fontSize: "1.5em", marginBottom: "20px", textAlign: "center" }}>
          Current Value: {currentValue.toFixed(2)}
        </p>
        <Counter
          value={currentValue}
          // Most props are left to their sensible defaults.
          // You can uncomment and modify these to customize the look:
          // fontSize={80}
          // padding={4}
          // gap={10}
          // borderRadius={8}
          // horizontalPadding={12}
          // textColor="#61dafb"
          // fontWeight="bold"
          // gradientHeight={20}
          // gradientFrom="rgba(58, 63, 71, 1)" // Match container background for a subtle fade
          // gradientTo="rgba(58, 63, 71, 0)"
        />
      </div>

      <p style={{ fontSize: "1.2em", maxWidth: "700px", textAlign: "center", lineHeight: "1.6" }}>{`
        This example showcases the 'Counter' component's smooth numerical animations.
        The value updates every 100 milliseconds, demonstrating its ability to elegantly
        transition between numbers using a spring physics effect. Default styling is
        applied, including a subtle gradient overlay at the top and bottom.
      `}</p>
    </div>
  );
};

export default Example;
