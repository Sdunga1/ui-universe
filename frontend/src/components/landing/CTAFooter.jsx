import React from 'react';
import { Github, Twitter, ArrowRight } from 'lucide-react';

const CTAFooter = () => {
  return (
    <>
      {/* Final CTA Section */}
      <section className="py-32 px-6 scroll-reveal relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#ee502c]/5 to-transparent"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[400px] bg-[#ee502c] opacity-10 blur-[120px]"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-6xl md:text-7xl font-azeret font-bold mb-8 leading-tight">
            Start building with
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#ee502c] to-[#ff6b4a]">
              uiUniverse
            </span>
          </h2>
          
          <p className="text-xl text-[#a0a0a0] mb-12 max-w-2xl mx-auto">
            Join thousands of developers shipping beautiful, animated interfaces faster than ever.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button className="group px-8 py-4 bg-[#ee502c] text-white rounded-lg font-medium hover:bg-[#ff5c35] transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(238,80,44,0.4)] flex items-center justify-center gap-2">
              Browse Components
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-8 py-4 border border-neutral-800 text-white rounded-lg font-medium hover:border-[#ee502c] hover:text-[#ee502c] transition-all hover:scale-105 flex items-center justify-center gap-2">
              <Github className="w-5 h-5" />
              View on GitHub
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-12 border-t border-[#1a1a1a]">
            <div>
              <div className="text-4xl font-azeret font-bold text-[#ee502c] mb-2">50+</div>
              <div className="text-sm text-[#a0a0a0]">Components</div>
            </div>
            <div>
              <div className="text-4xl font-azeret font-bold text-[#ee502c] mb-2">100%</div>
              <div className="text-sm text-[#a0a0a0]">TypeScript</div>
            </div>
            <div>
              <div className="text-4xl font-azeret font-bold text-[#ee502c] mb-2">A11y</div>
              <div className="text-sm text-[#a0a0a0]">Accessible</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1a1a1a] py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#ee502c] to-[#ff6b4a]"></div>
                <span className="text-xl font-azeret font-bold">uiUniverse</span>
              </div>
              <p className="text-sm text-[#a0a0a0]">
                AI-native motion components for React & Next.js
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="text-sm font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-[#a0a0a0]">
                <li><a href="#" className="hover:text-[#ee502c] transition-colors">Components</a></li>
                <li><a href="#" className="hover:text-[#ee502c] transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-[#ee502c] transition-colors">Templates</a></li>
                <li><a href="#" className="hover:text-[#ee502c] transition-colors">Pricing</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-[#a0a0a0]">
                <li><a href="#" className="hover:text-[#ee502c] transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-[#ee502c] transition-colors">Changelog</a></li>
                <li><a href="#" className="hover:text-[#ee502c] transition-colors">Examples</a></li>
                <li><a href="#" className="hover:text-[#ee502c] transition-colors">Community</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-[#a0a0a0]">
                <li><a href="#" className="hover:text-[#ee502c] transition-colors">About</a></li>
                <li><a href="#" className="hover:text-[#ee502c] transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-[#ee502c] transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-[#ee502c] transition-colors">Legal</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-8 border-t border-[#1a1a1a] flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-[#a0a0a0]">
              © 2024 uiUniverse. All rights reserved.
            </p>
            
            <div className="flex gap-6">
              <a href="#" className="text-[#a0a0a0] hover:text-[#ee502c] transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-[#a0a0a0] hover:text-[#ee502c] transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default CTAFooter;
