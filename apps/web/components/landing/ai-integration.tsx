import { Sparkles } from "lucide-react";

const generatedCodeHtml = `<span class="text-purple-400">import</span> { <span class="text-blue-400">StaggerGroup</span>, <span class="text-blue-400">FadeUp</span>, <span class="text-blue-400">GradientBackground</span> }
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
}`;

const aiTools = ["Claude Sonnet", "GitHub Copilot", "Cursor", "Windsurf", "ChatGPT"];

export function AIIntegration() {
  return (
    <section className="py-32 px-6 scroll-reveal relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--accent)] opacity-5 blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--accent)]/10 border border-[var(--accent)]/30 rounded-none mb-6">
            <Sparkles className="w-4 h-4 text-[var(--accent)]" />
            <span className="text-sm text-[var(--accent)] font-medium">Built for the AI era</span>
          </div>
          <h2 className="text-5xl font-azeret font-bold mb-6">
            Your AI assistant already knows uiUniverse
          </h2>
          <p className="text-xl text-[var(--muted)] max-w-3xl mx-auto">
            Every component includes AI-readable descriptors. Claude, Cursor, and Copilot understand
            your components natively.
          </p>
        </div>

        {/* Chat demo */}
        <div className="max-w-5xl mx-auto">
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-none overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-[var(--border)]">
              <div className="flex gap-2">
                <div className="w-3 h-3 bg-red-500/50" />
                <div className="w-3 h-3 bg-yellow-500/50" />
                <div className="w-3 h-3 bg-green-500/50" />
              </div>
              <span className="text-sm text-[var(--muted)] font-mono">AI Assistant</span>
              <div className="ml-auto flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 animate-pulse" />
                <span className="text-xs text-[var(--muted)]">Online</span>
              </div>
            </div>

            <div className="p-8 space-y-6">
              {/* User prompt */}
              <div className="flex justify-end">
                <div className="max-w-[80%] bg-[var(--accent)] text-white rounded-none px-6 py-4">
                  <p className="text-sm font-medium">
                    Create a SaaS landing page hero with a gradient background and staggered text
                    animation
                  </p>
                </div>
              </div>

              {/* AI response */}
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="bg-[var(--border)] rounded-none px-6 py-4">
                    <p className="text-sm text-[var(--muted)] mb-4">
                      I&apos;ll create a hero section using uiUniverse components with staggered
                      animations:
                    </p>
                    <div className="bg-[var(--card)] rounded-none border border-[#2a2a2a] p-4 font-mono text-xs overflow-x-auto">
                      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static syntax-highlighted code string, no user input */}
                      <pre
                        className="text-[var(--muted)]"
                        dangerouslySetInnerHTML={{ __html: generatedCodeHtml }}
                      />
                    </div>
                    <div className="flex items-center gap-2 mt-4 text-sm text-[var(--muted)]">
                      <div className="w-2 h-2 bg-green-500" />
                      <span>Code ready to use &bull; Fully typed &bull; Accessible</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Supported AI tools */}
          <div className="mt-12 text-center">
            <p className="text-sm text-[var(--muted)] mb-4">Works perfectly with</p>
            <div className="flex flex-wrap gap-4 justify-center items-center">
              {aiTools.map((tool) => (
                <div
                  key={tool}
                  className="px-4 py-2 bg-[var(--card)] border border-[var(--border)] rounded-none text-sm text-[var(--muted)] hover:border-[var(--accent)] hover:text-white transition-all"
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
}
