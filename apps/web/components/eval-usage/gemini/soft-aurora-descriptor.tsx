import SoftAurora from "../../fixtures/SoftAurora"; // Assuming SoftAurora.jsx is in the same directory or correctly aliased

const Example = () => {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <SoftAurora
        // Using sensible defaults based on the descriptor
        speed={0.6}
        scale={1.5}
        brightness={1}
        color1="#f7f7f7"
        color2="#e100ff"
        noiseFrequency={2.5}
        noiseAmplitude={1}
        bandHeight={0.5}
        bandSpread={1}
        octaveDecay={0.1}
        layerOffset={0}
        colorSpeed={1}
        enableMouseInteraction={true}
        mouseInfluence={0.25}
      />
      <div
        style={{
          position: "relative",
          zIndex: 1, // Ensure content is above the aurora
          textAlign: "center",
          color: "white",
          textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
          padding: "2rem",
          backgroundColor: "rgba(0, 0, 0, 0.3)",
          borderRadius: "10px",
        }}
      >
        <h1 style={{ fontSize: "3rem", margin: "0 0 1rem" }}>Welcome to the Aurora!</h1>
        <p style={{ fontSize: "1.2rem" }}>
          Experience the mesmerizing SoftAurora background effect.
        </p>
        <p style={{ fontSize: "1.2rem" }}>Move your mouse to interact with the lights!</p>
      </div>
    </div>
  );
};

export default Example;
