// @ts-nocheck
import CircularGallery from "../../fixtures/CircularGallery"; // Adjust the path as necessary

const exampleItems = [
  { image: "https://picsum.photos/id/10/800/600", text: "Nature's Path" },
  { image: "https://picsum.photos/id/20/800/600", text: "Urban Jungle" },
  { image: "https://picsum.photos/id/30/800/600", text: "Desert Sands" },
  { image: "https://picsum.photos/id/40/800/600", text: "Mountain Peaks" },
  { image: "https://picsum.photos/id/50/800/600", text: "Ocean Depths" },
  { image: "https://picsum.photos/id/60/800/600", text: "Forest Canopy" },
  { image: "https://picsum.photos/id/70/800/600", text: "City Lights" },
  { image: "https://picsum.photos/id/80/800/600", text: "Starry Night" },
];

export default function Example() {
  return (
    <div className="w-screen h-screen bg-gray-900 flex items-center justify-center">
      {/* 
        The CircularGallery component itself takes `w-full h-full` classes, 
        so it will expand to fill the parent div.
        Ensure the parent div has a defined size for the gallery to render correctly.
      */}
      <div className="w-[90vw] h-[70vh] max-w-screen-lg">
        <CircularGallery
          items={exampleItems}
          bend={2} // Slightly more bend than default
          textColor="#E0E0E0" // Light grey for text
          borderRadius={0.1} // Slightly more rounded corners
          font="bold 40px 'Arial Black'" // A different, bolder font
          scrollSpeed={3} // Slightly faster scroll
          scrollEase={0.1} // More aggressive easing
        />
      </div>
    </div>
  );
}
