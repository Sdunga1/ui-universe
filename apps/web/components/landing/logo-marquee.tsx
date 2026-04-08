"use client";

import {
  AnthropicIcon,
  CopilotIcon,
  CursorIcon,
  FramerIcon,
  NextDotJsIcon,
  ReactIcon,
  TailwindCSSIcon,
  VercelIcon,
} from "./tech-icons";

const techLogos = [
  { name: "Claude", Icon: AnthropicIcon },
  { name: "Cursor", Icon: CursorIcon },
  { name: "Copilot", Icon: CopilotIcon },
  { name: "React", Icon: ReactIcon },
  { name: "Next.js", Icon: NextDotJsIcon },
  { name: "Tailwind CSS", Icon: TailwindCSSIcon },
  { name: "Vercel", Icon: VercelIcon },
  { name: "Framer", Icon: FramerIcon },
];

export function LogoMarquee() {
  const tripled = [...techLogos, ...techLogos, ...techLogos];

  return (
    <section className="relative py-20 border-y border-neutral-900 overflow-hidden">
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[var(--background)] to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[var(--background)] to-transparent z-10" />

      <div className="text-center mb-12">
        <p className="text-sm uppercase tracking-wider text-[var(--muted)] font-mono">
          Built for your stack. Understood by your AI.
        </p>
      </div>

      <div className="flex animate-marquee">
        {tripled.map((logo, index) => {
          const Icon = logo.Icon;
          return (
            <div
              key={`${logo.name}-${index}`}
              className="flex items-center justify-center min-w-[200px] mx-8 grayscale hover:grayscale-0 transition-all duration-300 hover:scale-110"
            >
              <div className="flex items-center gap-3">
                <Icon className="w-8 h-8 text-neutral-600 group-hover:text-neutral-400 transition-colors" />
                <span className="font-mono text-lg text-neutral-600 hover:text-neutral-400 transition-colors">
                  {logo.name}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
