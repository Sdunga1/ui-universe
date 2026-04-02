import React, { useState } from 'react';
import { componentDemos } from '../../utils/mockData';

const ComponentGrid = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <section className="py-32 px-6 scroll-reveal">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-5xl font-azeret font-bold mb-6">
            50+ components that feel alive
          </h2>
          <p className="text-xl text-[#a0a0a0] max-w-2xl mx-auto">
            Every component is designed with motion in mind. Hover to see them in action.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {componentDemos.map((demo, index) => (
            <div
              key={index}
              className="component-demo-card group relative aspect-square rounded-2xl border border-[#1a1a1a] bg-[#0a0a0a] overflow-hidden cursor-pointer hover:border-[#ee502c]/50 transition-all duration-500"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{
                animationDelay: `${index * 50}ms`
              }}
            >
              {/* Demo content */}
              <div className="absolute inset-0 flex items-center justify-center p-6">
                {demo.type === 'gradient' && (
                  <div 
                    className={`w-full h-full rounded-xl transition-all duration-1000 ${
                      hoveredIndex === index ? 'scale-110 rotate-6' : 'scale-100 rotate-0'
                    }`}
                    style={{
                      background: demo.content
                    }}
                  ></div>
                )}

                {demo.type === 'text-animate' && (
                  <div className="text-center w-full">
                    <h3 className="text-3xl font-azeret font-bold">
                      {demo.content.split('').map((char, i) => (
                        <span
                          key={i}
                          className={`inline-block transition-all duration-300 ${
                            hoveredIndex === index ? 'animate-wave text-[#ee502c]' : ''
                          }`}
                          style={{
                            animationDelay: `${i * 50}ms`
                          }}
                        >
                          {char === ' ' ? '\u00A0' : char}
                        </span>
                      ))}
                    </h3>
                  </div>
                )}

                {demo.type === 'card-stack' && (
                  <div className="relative w-full h-full">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className={`absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] rounded-lg border border-[#2a2a2a] transition-all duration-500`}
                        style={{
                          transform: hoveredIndex === index 
                            ? `translateY(${i * -20}px) rotate(${i * 3}deg)` 
                            : `translateY(${i * 10}px) rotate(0deg)`,
                          zIndex: 3 - i
                        }}
                      ></div>
                    ))}
                  </div>
                )}

                {demo.type === 'pulse-ring' && (
                  <div className="relative">
                    <div className={`w-24 h-24 rounded-full bg-[#ee502c] ${hoveredIndex === index ? 'animate-ping' : ''}`}></div>
                    <div className="absolute inset-0 w-24 h-24 rounded-full bg-[#ee502c]"></div>
                  </div>
                )}

                {demo.type === 'parallax-layers' && (
                  <div className="relative w-full h-full">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className={`absolute inset-0 rounded-lg transition-transform duration-700`}
                        style={{
                          background: `linear-gradient(135deg, rgba(238,80,44,${0.3 - i * 0.1}) 0%, transparent 100%)`,
                          transform: hoveredIndex === index ? `translateX(${i * 15}px) translateY(${i * -10}px)` : 'translateX(0) translateY(0)'
                        }}
                      ></div>
                    ))}
                  </div>
                )}

                {demo.type === 'grid-reveal' && (
                  <div className="grid grid-cols-3 gap-2 w-full">
                    {[...Array(9)].map((_, i) => (
                      <div
                        key={i}
                        className={`aspect-square bg-[#ee502c] rounded transition-all duration-500`}
                        style={{
                          opacity: hoveredIndex === index ? 1 : 0.2,
                          transform: hoveredIndex === index ? 'scale(1)' : 'scale(0.8)',
                          transitionDelay: `${i * 50}ms`
                        }}
                      ></div>
                    ))}
                  </div>
                )}

                {demo.type === 'morphing-shape' && (
                  <div
                    className={`w-32 h-32 bg-gradient-to-br from-[#ee502c] to-[#ff6b4a] transition-all duration-700`}
                    style={{
                      borderRadius: hoveredIndex === index ? '50%' : '20%',
                      transform: hoveredIndex === index ? 'rotate(180deg) scale(1.1)' : 'rotate(0deg) scale(1)'
                    }}
                  ></div>
                )}

                {demo.type === 'stagger-bars' && (
                  <div className="flex gap-2 items-end h-32">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`w-8 bg-[#ee502c] rounded-t transition-all duration-500`}
                        style={{
                          height: hoveredIndex === index ? `${100 - i * 15}%` : '30%',
                          transitionDelay: `${i * 50}ms`
                        }}
                      ></div>
                    ))}
                  </div>
                )}
              </div>

              {/* Label */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#050505] to-transparent">
                <p className="text-sm font-medium text-white group-hover:text-[#ee502c] transition-colors">
                  {demo.name}
                </p>
              </div>

              {/* Hover glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[#ee502c] opacity-10 blur-[40px]"></div>
              </div>
            </div>
          ))}
        </div>

        {/* View all CTA */}
        <div className="text-center mt-16">
          <button className="px-8 py-4 border border-[#ee502c] text-[#ee502c] rounded-lg font-medium hover:bg-[#ee502c] hover:text-white transition-all hover:scale-105">
            View All Components
          </button>
        </div>
      </div>
    </section>
  );
};

export default ComponentGrid;
