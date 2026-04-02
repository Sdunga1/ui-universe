import React, { useState, useEffect } from 'react';
import { Copy, Check } from 'lucide-react';

const codeExample = `import { FadeUp, StaggerGroup } from "@ui-universe/ui";

export function Hero() {
  return (
    <StaggerGroup stagger="normal">
      <FadeUp>
        <span className="text-sm text-[#ee502c]">
          Introducing uiUniverse
        </span>
      </FadeUp>
      <FadeUp>
        <h1 className="text-6xl font-bold">
          Ship stunning pages<br />in minutes.
        </h1>
      </FadeUp>
      <FadeUp>
        <p className="text-xl text-neutral-400">
          AI-native motion components for React & Next.js
        </p>
      </FadeUp>
    </StaggerGroup>
  );
}`;

const CodeShowcase = () => {
  const [copied, setCopied] = useState(false);
  const [animatePreview, setAnimatePreview] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(codeExample);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    // Trigger preview animation on mount
    const timer = setTimeout(() => setAnimatePreview(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="py-32 px-6 scroll-reveal">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-azeret font-bold mb-6">
            From code to motion in seconds
          </h2>
          <p className="text-xl text-[#a0a0a0]">
            Write clean React code. Get beautiful animations automatically.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Code Editor */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#ee502c] to-[#ff6b4a] rounded-2xl opacity-20 group-hover:opacity-30 blur transition-opacity"></div>
            <div className="relative bg-[#0a0a0a] rounded-2xl border border-[#1a1a1a] overflow-hidden">
              {/* Editor header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#1a1a1a]">
                <div className="flex items-center gap-2">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                  </div>
                  <span className="text-sm text-[#a0a0a0] ml-4 font-mono">Hero.jsx</span>
                </div>
                <button
                  onClick={handleCopy}
                  className="p-2 hover:bg-[#1a1a1a] rounded-lg transition-colors"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4 text-[#a0a0a0]" />
                  )}
                </button>
              </div>

              {/* Code content */}
              <div className="p-6 font-mono text-sm overflow-x-auto">
                <pre className="text-[#a0a0a0]" dangerouslySetInnerHTML={{
                  __html: `<span class="text-purple-400">import</span> { <span class="text-blue-400">FadeUp</span>, <span class="text-blue-400">StaggerGroup</span> } <span class="text-purple-400">from</span> <span class="text-green-400">"@ui-universe/ui"</span>;

<span class="text-purple-400">export function</span> <span class="text-yellow-400">Hero</span>() {
  <span class="text-purple-400">return</span> (
    &lt;<span class="text-blue-400">StaggerGroup</span> <span class="text-cyan-400">stagger</span>=<span class="text-green-400">"normal"</span>&gt;
      &lt;<span class="text-blue-400">FadeUp</span>&gt;
        &lt;<span class="text-pink-400">span</span> <span class="text-cyan-400">className</span>=<span class="text-green-400">"text-sm text-[#ee502c]"</span>&gt;
          Introducing uiUniverse
        &lt;/<span class="text-pink-400">span</span>&gt;
      &lt;/<span class="text-blue-400">FadeUp</span>&gt;
      &lt;<span class="text-blue-400">FadeUp</span>&gt;
        &lt;<span class="text-pink-400">h1</span> <span class="text-cyan-400">className</span>=<span class="text-green-400">"text-6xl font-bold"</span>&gt;
          Ship stunning pages&lt;<span class="text-pink-400">br</span> /&gt; in minutes.
        &lt;/<span class="text-pink-400">h1</span>&gt;
      &lt;/<span class="text-blue-400">FadeUp</span>&gt;
      &lt;<span class="text-blue-400">FadeUp</span>&gt;
        &lt;<span class="text-pink-400">p</span> <span class="text-cyan-400">className</span>=<span class="text-green-400">"text-xl text-neutral-400"</span>&gt;
          AI-native motion components for React & Next.js
        &lt;/<span class="text-pink-400">p</span>&gt;
      &lt;/<span class="text-blue-400">FadeUp</span>&gt;
    &lt;/<span class="text-blue-400">StaggerGroup</span>&gt;
  );
}`
                }}>
                </pre>
              </div>
            </div>
          </div>

          {/* Visual Preview */}
          <div className="relative">
            <div className="bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a] rounded-2xl border border-[#1a1a1a] p-12 min-h-[400px] flex flex-col justify-center">
              {/* Animated preview */}
              <div className="space-y-6">
                <div className={`transition-all duration-700 ${animatePreview ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                  <span className="text-sm text-[#ee502c] font-medium">Introducing uiUniverse</span>
                </div>
                <div className={`transition-all duration-700 delay-200 ${animatePreview ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                  <h1 className="text-5xl font-azeret font-bold leading-tight">
                    Ship stunning pages<br />in minutes.
                  </h1>
                </div>
                <div className={`transition-all duration-700 delay-400 ${animatePreview ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                  <p className="text-xl text-neutral-400">
                    AI-native motion components for React & Next.js
                  </p>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute top-4 right-4 text-xs text-[#a0a0a0] font-mono">Live Preview</div>
              <div className="absolute bottom-4 left-4">
                <div className="flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#ee502c] animate-pulse"></div>
                  <span className="text-xs text-[#a0a0a0] font-mono">Animating</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CodeShowcase;
