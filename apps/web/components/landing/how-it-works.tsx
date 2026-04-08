import { Code, Download, Rocket } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Download,
    title: "Install",
    command: "pnpm add @ui-universe/ui",
    description: "One command. Zero configuration. Start building immediately.",
  },
  {
    number: "02",
    icon: Code,
    title: "Import & Use",
    command: 'import { FadeUp } from "@ui-universe/ui"',
    description:
      "Import components and compose your page. AI descriptors are included automatically — your AI tools already understand every prop.",
  },
  {
    number: "03",
    icon: Rocket,
    title: "Ship",
    command: "npm run build",
    description:
      "Tree-shakeable, TypeScript-first, accessible. Production-ready from the first build.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-32 px-6 scroll-reveal relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--accent)]/5 to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-5xl font-azeret font-bold mb-6">How it works</h2>
          <p className="text-xl text-[var(--muted)]">
            Three steps from empty project to production-ready interface
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-16 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--accent)]/30 to-transparent" />

          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="relative group"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="flex justify-center mb-8 relative z-10">
                  <div className="w-32 h-32 border-2 border-[var(--border)] bg-[var(--card)] flex items-center justify-center group-hover:border-[var(--accent)] transition-all duration-500 group-hover:scale-110">
                    <div className="text-center">
                      <div className="text-4xl font-azeret font-bold text-[var(--accent)] mb-1">
                        {step.number}
                      </div>
                      <Icon className="w-6 h-6 text-[var(--muted)] mx-auto group-hover:text-[var(--accent)] transition-colors" />
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <h3 className="text-2xl font-azeret font-bold mb-4 group-hover:text-[var(--accent)] transition-colors">
                    {step.title}
                  </h3>
                  <div className="bg-[var(--card)] border border-[var(--border)] rounded-none p-4 mb-4 font-mono text-sm text-[var(--accent)] group-hover:border-[var(--accent)]/50 transition-colors">
                    {step.command}
                  </div>
                  <p className="text-[var(--muted)] leading-relaxed">{step.description}</p>
                </div>

                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-[var(--accent)] opacity-0 group-hover:opacity-10 blur-[80px] transition-opacity duration-500 pointer-events-none" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
