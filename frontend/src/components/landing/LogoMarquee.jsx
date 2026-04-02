import React from 'react';
import { techLogos } from '../../utils/mockData';

const LogoMarquee = () => {
  return (
    <section className="relative py-20 border-y border-neutral-900 overflow-hidden scroll-reveal">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#050505] to-transparent z-10"></div>
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#050505] to-transparent z-10"></div>
      
      <div className="text-center mb-12">
        <p className="text-sm uppercase tracking-wider text-[#a0a0a0] font-mono">Works seamlessly with</p>
      </div>

      {/* Infinite scrolling logos */}
      <div className="flex animate-marquee">
        {[...techLogos, ...techLogos, ...techLogos].map((logo, index) => (
          <div
            key={index}
            className="flex items-center justify-center min-w-[200px] mx-8 grayscale hover:grayscale-0 transition-all duration-300 hover:scale-110"
          >
            <span className="text-2xl font-mono text-neutral-600 hover:text-neutral-400 transition-colors">
              {logo.icon} {logo.name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default LogoMarquee;
