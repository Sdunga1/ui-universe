import ShapeGrid from "../../fixtures/ShapeGrid";

export default function Example() {
  return (
    <div style={{ height: "100vh", width: "100%", position: "relative" }}>
      <ShapeGrid
        direction="diagonal"
        speed={1}
        borderColor="#666"
        squareSize={60}
        hoverFillColor="#3b82f6"
        shape="square"
        hoverTrailAmount={3}
      />

      {/* Example content overlay */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
          color: "#fff",
          zIndex: 10,
          padding: "2rem",
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          borderRadius: "12px",
          backdropFilter: "blur(10px)",
        }}
      >
        <h1 style={{ fontSize: "3rem", margin: "0 0 1rem 0", fontWeight: "bold" }}>
          Interactive Grid
        </h1>
        <p style={{ fontSize: "1.2rem", margin: "0 0 2rem 0", opacity: 0.9 }}>
          Move your mouse over the grid to see the hover effects and trails
        </p>
        <button
          style={{
            padding: "1rem 2rem",
            fontSize: "1.1rem",
            backgroundColor: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            transition: "background-color 0.3s ease",
          }}
        >
          Get Started
        </button>
      </div>
    </div>
  );
}
