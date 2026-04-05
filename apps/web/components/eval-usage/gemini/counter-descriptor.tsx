import Counter from "../../fixtures/Counter"; // Assuming Counter.jsx is in the same directory

const Example = () => {
  const primaryValue = 12345;
  const secondaryValue = 99;
  const decimalValue = 765.43;

  return (
    <div
      style={{
        fontFamily:
          'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#2e3a4e", // A dark background for contrast
        color: "white",
        padding: "20px",
        gap: "40px",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
        Animated Number Counter Examples
      </h1>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "#3b475c",
          padding: "30px 40px",
          borderRadius: "12px",
          boxShadow: "0 8px 16px rgba(0,0,0,0.3)",
          gap: "20px",
        }}
      >
        <h2 style={{ margin: 0, color: "#f0f0f0" }}>Primary Display</h2>
        <Counter
          value={primaryValue}
          fontSize={120} // Large font size for prominence
          textColor="#61dafb" // React blue-ish color
          fontWeight={900} // Extra bold
          gap={16} // More space between digits
          borderRadius={10}
          horizontalPadding={20}
          gradientHeight={25} // Taller fade effect
          gradientFrom="#3b475c" // Match the container background for seamless fade
          gradientTo="rgba(97, 218, 251, 0)" // Fade to transparent version of text color
        />
        <p style={{ fontSize: "1.2em", opacity: 0.8 }}>
          Current target value: <code style={{ color: "#61dafb" }}>{primaryValue}</code>
        </p>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "#4a5b78",
          padding: "25px 35px",
          borderRadius: "10px",
          boxShadow: "0 6px 12px rgba(0,0,0,0.2)",
          gap: "15px",
        }}
      >
        <h2 style={{ margin: 0, color: "#e0e0e0" }}>With Fewer Places</h2>
        <Counter
          value={secondaryValue}
          places={[10, 1]} // Explicitly show tens and ones place
          fontSize={80}
          textColor="#a7f3d0" // A light green
          fontWeight={600}
          gap={10}
          borderRadius={6}
          horizontalPadding={12}
          gradientHeight={18}
          gradientFrom="#4a5b78" // Match this container's background
        />
        <p style={{ fontSize: "1.1em", opacity: 0.7 }}>
          Showing value <code style={{ color: "#a7f3d0" }}>{secondaryValue}</code> with custom
          places.
        </p>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "#5d739b",
          padding: "25px 35px",
          borderRadius: "10px",
          boxShadow: "0 6px 12px rgba(0,0,0,0.2)",
          gap: "15px",
        }}
      >
        <h2 style={{ margin: 0, color: "#d0d0d0" }}>With Decimals</h2>
        <Counter
          value={decimalValue}
          places={[100, 10, 1, ".", 0.1, 0.01]} // Explicitly define decimal places
          fontSize={70}
          textColor="#fbd38d" // A light orange/yellow
          fontWeight="normal" // Default font weight
          gap={8}
          borderRadius={5}
          horizontalPadding={10}
          gradientHeight={16}
          gradientFrom="#5d739b" // Match this container's background
        />
        <p style={{ fontSize: "1.1em", opacity: 0.7 }}>
          Displaying <code style={{ color: "#fbd38d" }}>{decimalValue}</code> with two decimal
          places.
        </p>
      </div>
    </div>
  );
};

export default Example;
