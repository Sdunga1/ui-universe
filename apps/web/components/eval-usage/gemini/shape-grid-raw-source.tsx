import type React from "react";
import ShapeGrid from "../../fixtures/ShapeGrid"; // Assuming ShapeGrid.tsx is in the same directory

const Example: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4 relative">
      {/* Background ShapeGrid */}
      <div className="absolute inset-0 z-0">
        <ShapeGrid
          direction="diagonal"
          speed={0.5}
          borderColor="#333"
          hoverFillColor="#007bff"
          squareSize={50}
          shape="hexagon"
          hoverTrailAmount={5}
        />
      </div>

      {/* Content overlaying the grid */}
      <div className="relative z-10 bg-gray-800 bg-opacity-70 backdrop-blur-sm p-8 rounded-lg shadow-xl max-w-2xl text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to the Dynamic Grid!</h1>
        <p className="text-lg mb-6">
          This is an example of the `ShapeGrid` component in action. Move your mouse over the grid
          to see interactive hover effects and trails.
        </p>
        <p className="text-md text-gray-300">
          The grid direction, speed, shape, and colors are all customizable. Currently displaying a
          slow diagonal-moving hexagonal grid with a blue hover effect.
        </p>
        <div className="mt-8">
          <button
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition duration-300"
            onClick={() => alert("Button Clicked!")}
          >
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
};

export default Example;
