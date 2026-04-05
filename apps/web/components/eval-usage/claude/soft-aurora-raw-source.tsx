// @ts-nocheck
import SoftAurora from "../../fixtures/SoftAurora";

export default function Example() {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Aurora Background */}
      <div className="absolute inset-0">
        <SoftAurora
          speed={0.8}
          scale={2.0}
          brightness={1.2}
          color1="#00ff88"
          color2="#ff0066"
          noiseFrequency={3.0}
          noiseAmplitude={0.8}
          bandHeight={0.6}
          bandSpread={1.5}
          octaveDecay={0.15}
          layerOffset={2.5}
          colorSpeed={0.7}
          enableMouseInteraction={true}
          mouseInfluence={0.3}
        />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8">
        <div className="text-center space-y-6 max-w-4xl">
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-8 tracking-tight">Aurora</h1>

          <p className="text-xl md:text-2xl text-white/80 leading-relaxed">
            Experience the mesmerizing dance of lights in the digital sky. Move your mouse to
            interact with the flowing aurora waves.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
            <button className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-full text-white font-medium transition-all duration-300 hover:scale-105">
              Explore More
            </button>
            <button className="px-8 py-4 bg-gradient-to-r from-pink-500/20 to-cyan-500/20 hover:from-pink-500/30 hover:to-cyan-500/30 backdrop-blur-sm border border-white/20 rounded-full text-white font-medium transition-all duration-300 hover:scale-105">
              Watch Demo
            </button>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 max-w-6xl w-full">
          <div className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-300">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full mb-4 flex items-center justify-center">
              <span className="text-white text-xl">✦</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Interactive</h3>
            <p className="text-white/70">
              Responsive aurora that reacts to your mouse movements in real-time.
            </p>
          </div>

          <div className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-300">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full mb-4 flex items-center justify-center">
              <span className="text-white text-xl">◈</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Customizable</h3>
            <p className="text-white/70">
              Fine-tune colors, speed, and behavior to match your vision.
            </p>
          </div>

          <div className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-300">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full mb-4 flex items-center justify-center">
              <span className="text-white text-xl">◉</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Performant</h3>
            <p className="text-white/70">
              Hardware-accelerated WebGL rendering for smooth animations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
