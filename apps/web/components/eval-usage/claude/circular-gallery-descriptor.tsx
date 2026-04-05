import CircularGallery from "../../fixtures/CircularGallery";

export default function Example() {
  const galleryItems = [
    { image: "/api/placeholder/400/300", text: "Mountain Vista" },
    { image: "/api/placeholder/400/300", text: "Ocean Waves" },
    { image: "/api/placeholder/400/300", text: "Forest Path" },
    { image: "/api/placeholder/400/300", text: "Desert Dunes" },
    { image: "/api/placeholder/400/300", text: "City Lights" },
    { image: "/api/placeholder/400/300", text: "Lake Reflection" },
    { image: "/api/placeholder/400/300", text: "Snow Peaks" },
    { image: "/api/placeholder/400/300", text: "Sunset Sky" },
  ];

  return (
    <div
      style={{
        height: "600px",
        position: "relative",
        width: "100%",
        backgroundColor: "#1a1a1a",
      }}
    >
      <CircularGallery
        items={galleryItems}
        bend={3}
        textColor="#ffffff"
        borderRadius={0.05}
        scrollSpeed={2}
        scrollEase={0.05}
        font="bold 24px Figtree"
      />
    </div>
  );
}
