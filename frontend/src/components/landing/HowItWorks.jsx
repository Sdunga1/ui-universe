import React from 'react';
import { Download, Code, Rocket } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: Download,
    title: 'Install',
    command: 'pnpm add @ui-universe/ui',
    description: 'One command. Zero configuration. Start building immediately.'
  },
  {
    number: '02',
    icon: Code,
    title: 'Import & Use',
    command: 'import { FadeUp } from "@ui-universe/ui"',
    description: 'Import components, compose your page. TypeScript autocomplete guides you.'
  },
  {
    number: '03',
    icon: Rocket,
    title: 'Ship',
    command: 'npm run build',
    description: 'Production-ready, optimized, accessible. Deploy with confidence.'
  }
];

const HowItWorks = () => {
  return (
    <section className="py-32 px-6 scroll-reveal relative">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#ee502c]/5 to-transparent pointer-events-none"></div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-5xl font-azeret font-bold mb-6">
            How it works
          </h2>
          <p className="text-xl text-[#a0a0a0]">
            Three steps from empty project to production-ready interface
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-16 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#ee502c]/30 to-transparent"></div>

          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className="relative group"
                style={{
                  animationDelay: `${index * 150}ms`
                }}
              >
                {/* Step number circle */}
                <div className="flex justify-center mb-8 relative z-10">
                  <div className="w-32 h-32 rounded-full border-2 border-[#1a1a1a] bg-[#0a0a0a] flex items-center justify-center group-hover:border-[#ee502c] transition-all duration-500 group-hover:scale-110">
                    <div className="text-center">
                      <div className="text-4xl font-azeret font-bold text-[#ee502c] mb-1">
                        {step.number}
                      </div>
                      <Icon className="w-6 h-6 text-[#a0a0a0] mx-auto group-hover:text-[#ee502c] transition-colors" />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="text-center">
                  <h3 className="text-2xl font-azeret font-bold mb-4 group-hover:text-[#ee502c] transition-colors">
                    {step.title}
                  </h3>
                  
                  {/* Command box */}
                  <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-4 mb-4 font-mono text-sm text-[#ee502c] group-hover:border-[#ee502c]/50 transition-colors">
                    {step.command}
                  </div>

                  <p className="text-[#a0a0a0] leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Hover glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#ee502c] opacity-0 group-hover:opacity-10 blur-[80px] transition-opacity duration-500 pointer-events-none"></div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <button className="px-8 py-4 bg-[#ee502c] text-white rounded-lg font-medium hover:bg-[#ff5c35] transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(238,80,44,0.3)]">
            Get Started Now
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
