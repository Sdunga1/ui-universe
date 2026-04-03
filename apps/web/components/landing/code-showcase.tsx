"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useState } from "react";

const codeRaw = `import { FadeUp, StaggerGroup } from "@ui-universe/ui";

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

const codeHtml = `<span class="text-purple-400">import</span> { <span class="text-blue-400">FadeUp</span>, <span class="text-blue-400">StaggerGroup</span> } <span class="text-purple-400">from</span> <span class="text-green-400">"@ui-universe/ui"</span>;

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
          AI-native motion components for React &amp; Next.js
        &lt;/<span class="text-pink-400">p</span>&gt;
      &lt;/<span class="text-blue-400">FadeUp</span>&gt;
    &lt;/<span class="text-blue-400">StaggerGroup</span>&gt;
  );
}`;

export function CodeShowcase() {
  const [copied, setCopied] = useState(false);
  const [animatePreview, setAnimatePreview] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(codeRaw);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const timer = setTimeout(() => setAnimatePreview(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="py-32 px-6 scroll-reveal">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-azeret font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-400">
            From code to motion in seconds
          </h2>
          <p className="text-xl text-[var(--muted)]">
            Write clean React code. Get beautiful animations automatically.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Code editor */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[var(--accent)] to-[#ff6b4a] opacity-20 group-hover:opacity-40 blur-xl transition-all duration-700" />
            <div className="relative bg-[var(--card)] rounded-none border border-[var(--border)] overflow-hidden hover:border-[var(--accent)]/50 transition-all duration-500">
              <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)] bg-[var(--background)]">
                <div className="flex items-center gap-2">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 bg-red-500/50" />
                    <div className="w-3 h-3 bg-yellow-500/50" />
                    <div className="w-3 h-3 bg-green-500/50" />
                  </div>
                  <span className="text-sm text-[var(--muted)] ml-4 font-mono">Hero.tsx</span>
                </div>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="p-2 hover:bg-[var(--border)] rounded-none transition-all duration-300 hover:scale-110"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4 text-[var(--muted)]" />
                  )}
                </button>
              </div>
              <div className="p-6 font-mono text-sm overflow-x-auto">
                {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static syntax-highlighted code string, no user input */}
                <pre
                  className="text-[var(--muted)]"
                  dangerouslySetInnerHTML={{ __html: codeHtml }}
                />
              </div>
            </div>
          </div>

          {/* Visual preview */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 opacity-20 group-hover:opacity-30 blur-xl transition-all duration-700" />
            <div className="relative bg-gradient-to-br from-[var(--card)] to-[var(--border)] rounded-none border border-[var(--border)] p-12 min-h-[400px] flex flex-col justify-center hover:border-[var(--accent)]/30 transition-all duration-500">
              <div className="space-y-6">
                <div
                  className={`transition-all duration-1000 ${animatePreview ? "opacity-100 translate-y-0 blur-0" : "opacity-0 translate-y-8 blur-sm"}`}
                >
                  <span className="text-sm text-[var(--accent)] font-medium">
                    Introducing uiUniverse
                  </span>
                </div>
                <div
                  className={`transition-all duration-1000 delay-300 ${animatePreview ? "opacity-100 translate-y-0 blur-0" : "opacity-0 translate-y-8 blur-sm"}`}
                >
                  <h1 className="text-5xl font-azeret font-bold leading-tight">
                    Ship stunning pages
                    <br />
                    in minutes.
                  </h1>
                </div>
                <div
                  className={`transition-all duration-1000 delay-600 ${animatePreview ? "opacity-100 translate-y-0 blur-0" : "opacity-0 translate-y-8 blur-sm"}`}
                >
                  <p className="text-xl text-neutral-400">
                    AI-native motion components for React & Next.js
                  </p>
                </div>
              </div>

              <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1 bg-[var(--background)]/80 backdrop-blur-sm border border-[var(--border)]">
                <div className="w-2 h-2 bg-[var(--accent)] animate-pulse" />
                <span className="text-xs text-[var(--muted)] font-mono">Live Preview</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
