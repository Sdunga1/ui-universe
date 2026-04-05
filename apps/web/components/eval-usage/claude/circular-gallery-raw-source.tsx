import CircularGallery from "../../fixtures/CircularGallery";

const exampleItems = [
  {
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
    text: "Mountain Vista",
  },
  {
    image: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&h=600&fit=crop",
    text: "Misty Lake",
  },
  {
    image: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&h=600&fit=crop",
    text: "Forest Path",
  },
  {
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
    text: "Desert Dunes",
  },
  {
    image: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&h=600&fit=crop",
    text: "Ocean Waves",
  },
  {
    image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&h=600&fit=crop",
    text: "Cherry Blossoms",
  },
];

export default function Example() {
  return (
    <div className="w-full h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="absolute inset-0 flex flex-col">
        <div className="p-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-2">Interactive Gallery</h1>
          <p className="text-slate-300">
            Scroll horizontally or drag to explore the circular gallery
          </p>
        </div>

        <div className="flex-1">
          <CircularGallery
            items={exampleItems}
            bend={2.5}
            textColor="#e2e8f0"
            borderRadius={0.08}
            font="bold 28px system-ui, sans-serif"
            scrollSpeed={2.2}
            scrollEase={0.08}
          />
        </div>

        <div className="p-4 text-center text-slate-400 text-sm">
          Use mouse wheel, click & drag, or touch gestures to navigate
        </div>
      </div>
    </div>
  );
}
