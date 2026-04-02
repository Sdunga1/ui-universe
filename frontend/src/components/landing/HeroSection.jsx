import React from 'react';
import { Sparkles, Database, Beaker } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20">
      {/* Animated gradient orb */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#ee502c] opacity-10 blur-[120px] rounded-full animate-pulse-slow"></div>
      
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-6 animate-fade-in">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#ee502c] to-[#ff6b4a] flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-azeret font-bold">uiUniverse</h1>
        </div>

        {/* Tagline */}
        <div className="space-y-6 animate-fade-in-delay-1">
          <p className="text-sm uppercase tracking-wider text-[#ee502c] font-mono">
            AI-Native Motion UI Components
          </p>
          
          <h2 className="text-6xl md:text-7xl font-azeret font-bold leading-tight animate-fade-in-delay-2">
            Ship stunning pages<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-neutral-400">
              in minutes, not weeks
            </span>
          </h2>
          
          <p className="text-xl text-[#a0a0a0] max-w-2xl mx-auto animate-fade-in-delay-3">
            The first motion component library built for the AI era. 
            React, Next.js, and your favorite coding assistant.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12 animate-fade-in-delay-4">
          <button className="px-8 py-4 bg-[#ee502c] text-white rounded-lg font-medium hover:bg-[#ff5c35] transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(238,80,44,0.3)]">
            Browse Components
          </button>
          <button className="px-8 py-4 border border-neutral-800 text-white rounded-lg font-medium hover:border-[#ee502c] hover:text-[#ee502c] transition-all hover:scale-105">
            View on GitHub
          </button>
        </div>

        {/* Stats or badges */}
        <div className="flex flex-wrap gap-8 justify-center mt-16 text-sm text-[#a0a0a0] animate-fade-in-delay-5">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span>50+ Components</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <span>TypeScript First</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#ee502c]"></div>
            <span>AI-Ready</span>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce-slow">
        <div className="w-6 h-10 border-2 border-neutral-800 rounded-full flex justify-center pt-2">
          <div className="w-1 h-2 bg-[#ee502c] rounded-full animate-scroll-indicator"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
