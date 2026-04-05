// @ts-nocheck
import type React from "react";
import ShapeGrid from "../../fixtures/ShapeGrid";

const Example: React.FC = () => {
  return (
    <div className="relative w-full h-screen bg-gray-900 overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0">
        <ShapeGrid
          direction="diagonal"
          speed={0.5}
          borderColor="#333"
          squareSize={60}
          hoverFillColor="#4f46e5"
          shape="hexagon"
          hoverTrailAmount={8}
        />
      </div>

      {/* Content overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white">
        <div className="text-center max-w-4xl px-8">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            Interactive Grid
          </h1>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            Move your mouse around to interact with the animated hexagonal grid. The shapes respond
            to your cursor with a beautiful trailing effect.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <h3 className="text-lg font-semibold mb-3 text-blue-300">Dynamic Animation</h3>
              <p className="text-gray-300 text-sm">
                The grid continuously moves in a diagonal direction, creating a mesmerizing flow
                effect.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <h3 className="text-lg font-semibold mb-3 text-purple-300">Mouse Interaction</h3>
              <p className="text-gray-300 text-sm">
                Hover over the grid to see individual hexagons light up with smooth color
                transitions.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <h3 className="text-lg font-semibold mb-3 text-indigo-300">Trail Effect</h3>
              <p className="text-gray-300 text-sm">
                Your cursor leaves a fading trail of highlighted shapes as you move across the grid.
              </p>
            </div>
          </div>

          <button className="mt-8 px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-full font-semibold transition-all duration-300 transform hover:scale-105">
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default Example;
