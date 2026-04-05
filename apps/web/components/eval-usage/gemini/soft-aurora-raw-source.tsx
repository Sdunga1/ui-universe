// @ts-nocheck
import SoftAurora from "../../fixtures/SoftAurora"; // Adjust the import path as needed

export default function Example() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black">
      {/* The SoftAurora component will fill this container */}
      <SoftAurora
      // SoftAurora comes with sensible default props, so you can often
      // use it without passing any. However, you can easily customize it:
      // speed={0.8}
      // scale={2.0}
      // brightness={1.2}
      // color1="#FFD700" // Example: Gold
      // color2="#00FFFF" // Example: Cyan
      // enableMouseInteraction={true} // Defaults to true
      // mouseInfluence={0.3}
      />

      {/* Example content layered on top of the SoftAurora effect */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-white text-center z-10">
        <h1 className="text-6xl md:text-8xl font-extrabold mb-4 drop-shadow-xl">Aurora Lights</h1>
        <p className="text-xl md:text-2xl max-w-3xl mb-8 drop-shadow-lg leading-relaxed">
          Experience the serene and dynamic beauty of the Northern Lights, rendered right in your
          browser. Move your mouse to interact with the ethereal glow.
        </p>
        <button className="px-10 py-5 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white text-xl font-bold rounded-full shadow-xl transition-all duration-300 transform hover:scale-105">
          Start Your Journey
        </button>
      </div>
    </div>
  );
}
