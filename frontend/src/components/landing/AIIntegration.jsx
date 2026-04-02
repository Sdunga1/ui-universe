import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

const AIIntegration = () => {
  return (
    <section className="py-32 px-6 scroll-reveal relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#ee502c] opacity-5 blur-[150px] rounded-full"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#ee502c]/10 border border-[#ee502c]/30 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-[#ee502c]" />
            <span className="text-sm text-[#ee502c] font-medium">Built for the AI era</span>
          </div>
          <h2 className="text-5xl font-azeret font-bold mb-6">
            Your AI assistant already knows uiUniverse
          </h2>
          <p className="text-xl text-[#a0a0a0] max-w-3xl mx-auto">
            Every component includes AI-readable descriptors. Claude, Cursor, and Copilot understand your components natively.
          </p>
        </div>

        {/* Chat-style demo */}
        <div className="max-w-5xl mx-auto">
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl overflow-hidden">
            {/* Chat header */}
            <div className="flex items-center gap-3 px-6 py-4 border-b border-[#1a1a1a]">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
              </div>
              <span className="text-sm text-[#a0a0a0] font-mono">AI Assistant</span>
              <div className="ml-auto flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-xs text-[#a0a0a0]">Online</span>
              </div>
            </div>

            {/* Chat content */}
            <div className="p-8 space-y-6">
              {/* User prompt */}
              <div className="flex justify-end">
                <div className="max-w-[80%] bg-[#ee502c] text-white rounded-2xl rounded-tr-none px-6 py-4">
                  <p className="text-sm font-medium">
                    Create a SaaS landing page hero with a gradient background and staggered text animation
                  </p>
                </div>
              </div>

              {/* AI response */}
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="bg-[#1a1a1a] rounded-2xl rounded-tl-none px-6 py-4">
                    <p className="text-sm text-[#a0a0a0] mb-4">
                      I'll create a hero section using uiUniverse components with staggered animations:
                    </p>
                    
                    {/* Generated code */}
                    <div className="bg-[#0a0a0a] rounded-lg border border-[#2a2a2a] p-4 font-mono text-xs overflow-x-auto">
                      <pre className="text-[#a0a0a0]" dangerouslySetInnerHTML={{
                        __html: `<span class="text-purple-400">import</span> { <span class="text-blue-400">StaggerGroup</span>, <span class="text-blue-400">FadeUp</span>, <span class="text-blue-400">GradientBackground</span> }
<span class="text-purple-400">from</span> <span class="text-green-400">"@ui-universe/ui"</span>;

<span class="text-purple-400">export default function</span> <span class="text-yellow-400">Hero</span>() {
  <span class="text-purple-400">return</span> (
    &lt;<span class="text-blue-400">GradientBackground</span> <span class="text-cyan-400">variant</span>=<span class="text-green-400">"purple-blue"</span>&gt;
      &lt;<span class="text-blue-400">StaggerGroup</span> <span class="text-cyan-400">stagger</span>=<span class="text-green-400">"normal"</span>&gt;
        &lt;<span class="text-blue-400">FadeUp</span>&gt;
          &lt;<span class="text-pink-400">h1</span>&gt;Ship faster with AI&lt;/<span class="text-pink-400">h1</span>&gt;
        &lt;/<span class="text-blue-400">FadeUp</span>&gt;
        &lt;<span class="text-blue-400">FadeUp</span>&gt;
          &lt;<span class="text-pink-400">p</span>&gt;Build beautiful pages in minutes&lt;/<span class="text-pink-400">p</span>&gt;
        &lt;/<span class="text-blue-400">FadeUp</span>&gt;
      &lt;/<span class="text-blue-400">StaggerGroup</span>&gt;
    &lt;/<span class="text-blue-400">GradientBackground</span>&gt;
  );
}`
                      }}>
                      </pre>
                    </div>

                    <div className="flex items-center gap-2 mt-4 text-sm text-[#a0a0a0]">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span>Code ready to use • Fully typed • Accessible</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick actions */}
              <div className="flex gap-3 justify-end">
                <button className="px-4 py-2 text-sm border border-[#1a1a1a] rounded-lg hover:border-[#ee502c] transition-colors">
                  Regenerate
                </button>
                <button className="px-4 py-2 text-sm bg-[#ee502c] text-white rounded-lg hover:bg-[#ff5c35] transition-colors flex items-center gap-2">
                  Copy Code
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Supported AI tools */}
          <div className="mt-12 text-center">
            <p className="text-sm text-[#a0a0a0] mb-4">Works perfectly with</p>
            <div className="flex flex-wrap gap-6 justify-center items-center">
              {['Claude Sonnet', 'GitHub Copilot', 'Cursor', 'Windsurf', 'ChatGPT'].map((tool, index) => (
                <div
                  key={index}
                  className="px-4 py-2 bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg text-sm text-[#a0a0a0] hover:border-[#ee502c] hover:text-white transition-all"
                >
                  {tool}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIIntegration;
