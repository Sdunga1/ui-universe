// @ts-nocheck
import SoftAurora from "../../fixtures/SoftAurora";

export default function Example() {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      <SoftAurora
        color1="#f7f7f7"
        color2="#e100ff"
        speed={0.6}
        brightness={1}
        enableMouseInteraction={true}
        mouseInfluence={0.25}
      />

      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white">
        <h1 className="text-6xl font-bold mb-4 text-center bg-black/20 backdrop-blur-sm px-8 py-4 rounded-lg">
          Aurora Dreams
        </h1>
        <p className="text-xl text-center max-w-2xl px-6 bg-black/20 backdrop-blur-sm py-3 rounded-lg">
          Experience the mesmerizing beauty of the northern lights with this interactive WebGL
          aurora effect. Move your mouse to influence the flowing patterns.
        </p>
        <button className="mt-8 px-8 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-white hover:bg-white/30 transition-all duration-300">
          Explore More
        </button>
      </div>
    </div>
  );
}
