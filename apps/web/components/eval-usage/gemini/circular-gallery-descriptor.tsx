import CircularGallery from "../../fixtures/CircularGallery"; // Assuming CircularGallery is in the same directory or correctly aliased

const exampleItems = [
  { image: "https://via.placeholder.com/600x400/4CAF50/FFFFFF?text=Nature", text: "Green Hills" },
  {
    image: "https://via.placeholder.com/600x400/2196F3/FFFFFF?text=Cityscape",
    text: "Blue Skyline",
  },
  { image: "https://via.placeholder.com/600x400/FF9800/FFFFFF?text=Desert", text: "Orange Dunes" },
  { image: "https://via.placeholder.com/600x400/9C27B0/FFFFFF?text=Abstract", text: "Purple Haze" },
  { image: "https://via.placeholder.com/600x400/FFC107/333333?text=Sunset", text: "Golden Hour" },
];

const Example = () => {
  return (
    <div
      style={{
        height: "600px",
        position: "relative",
        backgroundColor: "#333", // Adding a background for better contrast with white text
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      <CircularGallery
        items={exampleItems}
        bend={3} // Default curvature
        textColor="#ffffff" // Default text color
        borderRadius={0.05} // Default border radius
        font="bold 32px Montserrat" // Slightly adjusted font for example
        scrollSpeed={2.5} // Slightly increased scroll speed
        scrollEase={0.07} // Slightly increased ease for a bit snappier feel
      />
    </div>
  );
};

export default Example;
