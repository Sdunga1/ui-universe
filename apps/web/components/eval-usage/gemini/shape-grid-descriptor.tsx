import ShapeGrid from "../../fixtures/ShapeGrid"; // Assuming ShapeGrid is in the same directory or correctly aliased

const Example = () => {
  return (
    <div
      style={{
        width: "100%",
        height: "500px", // ShapeGrid fills its parent, so give the parent explicit dimensions
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff", // Text color for visibility over the background
      }}
    >
      {/* ShapeGrid will act as the background */}
      <ShapeGrid
        direction="diagonal"
        speed={0.8}
        borderColor="#555"
        squareSize={60}
        hoverFillColor="#007bff"
        shape="hexagon"
        hoverTrailAmount={3}
      />

      {/* Example content rendered on top of the ShapeGrid background */}
      <div
        style={{
          position: "relative", // Position content relative to the parent div
          zIndex: 1, // Ensure content is above the canvas
          textAlign: "center",
          padding: "20px",
          backgroundColor: "rgba(0, 0, 0, 0.4)", // Semi-transparent background for readability
          borderRadius: "8px",
          maxWidth: "80%",
        }}
      >
        <h1>Welcome to the ShapeGrid Background!</h1>
        <p>
          This is an example of content placed over an animated ShapeGrid background. Hover your
          mouse around to see the interactive fill effects, and watch the shapes animate in a
          diagonal direction. We're currently using hexagons with a subtle trail.
        </p>
        <button
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Learn More
        </button>
      </div>
    </div>
  );
};

export default Example;
