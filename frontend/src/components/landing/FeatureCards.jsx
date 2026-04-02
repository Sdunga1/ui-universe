import React from 'react';
import { Sparkles, Layers, FlaskConical } from 'lucide-react';

const features = [
  {
    icon: Sparkles,
    title: 'AI-Native Components',
    description: 'Every component ships with a machine-readable JSON descriptor. AI coding tools generate correct code instantly.',
    color: '#ee502c'
  },
  {
    icon: Layers,
    title: 'Coherent Motion System',
    description: 'One motion system across all components. Same easings, durations, stagger patterns. Pages feel intentional.',
    color: '#3b82f6'
  },
  {
    icon: FlaskConical,
    title: 'Lab Mode',
    description: 'Configure, preview, and export production-ready code from a visual playground. No guesswork.',
    color: '#8b5cf6'
  }
];

const FeatureCards = () => {
  return (
    <section className="py-32 px-6 scroll-reveal">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-azeret font-bold mb-6">
            Built for modern development
          </h2>
          <p className="text-xl text-[#a0a0a0] max-w-2xl mx-auto">
            Everything you need to ship beautiful, animated interfaces faster than ever
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="feature-card group relative p-8 rounded-2xl border border-[#1a1a1a] bg-[#0a0a0a] hover:border-[#ee502c] transition-all duration-500 hover:scale-105 cursor-pointer overflow-hidden"
                style={{
                  animationDelay: `${index * 100}ms`
                }}
              >
                {/* Hover glow effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[200px] bg-[#ee502c] opacity-10 blur-[60px]"></div>
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#ee502c]/20 to-transparent border border-[#ee502c]/30 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                    <Icon className="w-7 h-7 text-[#ee502c]" />
                  </div>

                  <h3 className="text-2xl font-azeret font-bold mb-4 group-hover:text-[#ee502c] transition-colors">
                    {feature.title}
                  </h3>
                  
                  <p className="text-[#a0a0a0] leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Animated border gradient */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#ee502c]/20 via-transparent to-transparent"></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeatureCards;
