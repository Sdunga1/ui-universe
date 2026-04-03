import React, { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

const HeroSection = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20 overflow-hidden">
      {/* Animated gradient orbs with parallax */}
      <div 
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#ee502c] opacity-20 blur-[140px] rounded-full animate-pulse-slow"
        style={{
          transform: `translate(calc(-50% + ${mousePosition.x}px), calc(-50% + ${mousePosition.y}px))`
        }}
      ></div>
      <div 
        className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-purple-600 opacity-10 blur-[120px] rounded-full animate-float"
        style={{
          transform: `translate(${-mousePosition.x * 0.5}px, ${-mousePosition.y * 0.5}px)`
        }}
      ></div>
      
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Logo with fade in */}
        <div className="flex items-center justify-center gap-3 mb-6 animate-fade-in">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#ee502c] to-[#ff6b4a] flex items-center justify-center shadow-lg shadow-[#ee502c]/30 hover:scale-110 transition-transform duration-500 cursor-pointer">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-azeret font-bold">uiUniverse</h1>
        </div>

        {/* Tagline with stagger */}
        <div className="space-y-6">
          <p className="text-sm uppercase tracking-wider text-[#ee502c] font-mono animate-fade-in-delay-1">
            AI-Native Motion UI Components
          </p>
          
          <h2 className="text-6xl md:text-7xl font-azeret font-bold leading-tight animate-fade-in-delay-2">
            Ship stunning pages<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-300 to-neutral-500 animate-shimmer" style={{
              backgroundSize: '200% auto'
            }}>
              in minutes, not weeks
            </span>
          </h2>
          
          <p className="text-xl text-[#a0a0a0] max-w-2xl mx-auto animate-fade-in-delay-3 leading-relaxed">
            The first motion component library built for the AI era. 
            React, Next.js, and your favorite coding assistant.
          </p>
        </div>

        {/* CTA Buttons with enhanced hover */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12 animate-fade-in-delay-4">
          <button className="group relative px-8 py-4 bg-[#ee502c] text-white rounded-xl font-medium overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-[0_0_50px_rgba(238,80,44,0.5)]">
            <span className="relative z-10">Browse Components</span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#ff6b4a] to-[#ee502c] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </button>
          <button className="group relative px-8 py-4 border-2 border-neutral-800 text-white rounded-xl font-medium hover:border-[#ee502c] transition-all duration-500 hover:scale-105 hover:shadow-[0_0_30px_rgba(238,80,44,0.2)]">
            <span className="group-hover:text-[#ee502c] transition-colors duration-300">View on GitHub</span>
          </button>
        </div>

        {/* Stats with fade in */}
        <div className="flex flex-wrap gap-8 justify-center mt-16 text-sm text-[#a0a0a0] animate-fade-in-delay-5">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-2 h-2 rounded-full bg-green-500 group-hover:scale-125 transition-transform duration-300"></div>
            <span className="group-hover:text-white transition-colors duration-300">50+ Components</span>
          </div>
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-2 h-2 rounded-full bg-blue-500 group-hover:scale-125 transition-transform duration-300"></div>
            <span className="group-hover:text-white transition-colors duration-300">TypeScript First</span>
          </div>
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-2 h-2 rounded-full bg-[#ee502c] group-hover:scale-125 transition-transform duration-300"></div>
            <span className="group-hover:text-white transition-colors duration-300">AI-Ready</span>
          </div>
        </div>
      </div>

      {/* Scroll indicator with smooth animation */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce-slow">
        <div className="w-6 h-10 border-2 border-neutral-800 rounded-full flex justify-center pt-2 hover:border-[#ee502c] transition-colors duration-500 cursor-pointer">
          <div className="w-1 h-2 bg-[#ee502c] rounded-full animate-scroll-indicator"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
