"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useState } from "react";

const descriptorRaw = `{
  "name": "FadeUp",
  "slug": "fade-up",
  "category": "animations",
  "description": "Fades content upward into view",
  "props": {
    "children": { "type": "ReactNode", "required": true },
    "preset": { "type": "MotionPresetName", "default": "fadeUp" },
    "delay": { "type": "number", "description": "Delay in ms" },
    "triggerOnView": { "type": "boolean", "default": true }
  },
  "recommendedWith": ["StaggerGroup"],
  "aiPromptHint": "Use FadeUp for upward reveal animations. Wrap multiple in StaggerGroup for sequenced entry."
}`;

const descriptorHtml = `{
  <span class="text-cyan-400">"name"</span>: <span class="text-green-400">"FadeUp"</span>,
  <span class="text-cyan-400">"slug"</span>: <span class="text-green-400">"fade-up"</span>,
  <span class="text-cyan-400">"category"</span>: <span class="text-green-400">"animations"</span>,
  <span class="text-cyan-400">"description"</span>: <span class="text-green-400">"Fades content upward into view"</span>,
  <span class="text-cyan-400">"props"</span>: {
    <span class="text-cyan-400">"children"</span>: { <span class="text-cyan-400">"type"</span>: <span class="text-green-400">"ReactNode"</span>, <span class="text-cyan-400">"required"</span>: <span class="text-purple-400">true</span> },
    <span class="text-cyan-400">"preset"</span>: { <span class="text-cyan-400">"type"</span>: <span class="text-green-400">"MotionPresetName"</span>, <span class="text-cyan-400">"default"</span>: <span class="text-green-400">"fadeUp"</span> },
    <span class="text-cyan-400">"delay"</span>: { <span class="text-cyan-400">"type"</span>: <span class="text-green-400">"number"</span>, <span class="text-cyan-400">"description"</span>: <span class="text-green-400">"Delay in ms"</span> },
    <span class="text-cyan-400">"triggerOnView"</span>: { <span class="text-cyan-400">"type"</span>: <span class="text-green-400">"boolean"</span>, <span class="text-cyan-400">"default"</span>: <span class="text-purple-400">true</span> }
  },
  <span class="text-cyan-400">"recommendedWith"</span>: [<span class="text-green-400">"StaggerGroup"</span>],
  <span class="text-cyan-400">"aiPromptHint"</span>: <span class="text-green-400">"Use FadeUp for upward reveal animations. Wrap multiple in StaggerGroup for sequenced entry."</span>
}`;

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
  const [activeTab, setActiveTab] = useState<"code" | "descriptor">("code");

  const handleCopy = () => {
    navigator.clipboard.writeText(activeTab === "code" ? codeRaw : descriptorRaw);
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
                  <div className="flex ml-4 gap-0">
                    <button
                      type="button"
                      onClick={() => setActiveTab("code")}
                      className={`px-3 py-1 text-sm font-mono transition-all duration-300 border border-[var(--border)] ${
                        activeTab === "code"
                          ? "bg-[var(--card)] text-white border-b-transparent"
                          : "text-[var(--muted)] hover:text-white"
                      }`}
                    >
                      Your Code
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("descriptor")}
                      className={`px-3 py-1 text-sm font-mono transition-all duration-300 border border-[var(--border)] ${
                        activeTab === "descriptor"
                          ? "bg-[var(--card)] text-[var(--accent)] border-b-transparent"
                          : "text-[var(--muted)] hover:text-[var(--accent)]"
                      }`}
                    >
                      What AI Sees
                    </button>
                  </div>
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
                <pre
                  className="text-[var(--muted)]"
                  // biome-ignore lint/security/noDangerouslySetInnerHtml: static syntax-highlighted string, no user input
                  dangerouslySetInnerHTML={{
                    __html: activeTab === "code" ? codeHtml : descriptorHtml,
                  }}
                />
              </div>
              {activeTab === "descriptor" && (
                <div className="px-6 pb-4 text-xs text-[var(--muted)]">
                  <span className="text-[var(--accent)]">~30 lines</span> vs 500+ lines of source --
                  AI tools get the same quality with{" "}
                  <span className="text-[var(--accent)]">6x less input</span>
                </div>
              )}
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
