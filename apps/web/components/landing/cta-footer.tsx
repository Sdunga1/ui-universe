"use client";

import { ArrowRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { UIUniverseWordmark } from "../ui-universe-wordmark";

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      role="img"
      aria-labelledby="x-footer-title"
    >
      <title id="x-footer-title">X (Twitter)</title>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      role="img"
      aria-labelledby="gh-footer-title"
    >
      <title id="gh-footer-title">GitHub</title>
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      role="img"
      aria-labelledby="li-footer-title"
    >
      <title id="li-footer-title">LinkedIn</title>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

export function CTAFooter() {
  return (
    <>
      {/* Final CTA */}
      <section className="py-32 px-6 scroll-reveal relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--accent)]/5 to-transparent pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[400px] bg-[var(--accent)] opacity-10 blur-[120px] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-5xl md:text-6xl font-azeret font-bold mb-8 leading-tight">
            Start building with
            <UIUniverseWordmark className="text-6xl md:text-7xl block mt-2" />
          </h2>

          <p className="text-xl text-[var(--muted)] mb-12 max-w-2xl mx-auto">
            Join developers shipping beautiful, animated interfaces faster than ever.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <a
              href="/animations/fade-up"
              className="group px-8 py-4 bg-[var(--accent)] text-white rounded-none font-medium hover:bg-[var(--accent-hover)] transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(238,80,44,0.4)] flex items-center justify-center gap-2"
            >
              Browse Components
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="https://github.com/Sdunga1/ui-universe"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 border border-neutral-800 text-white rounded-none font-medium hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all hover:scale-105 flex items-center justify-center gap-2"
            >
              <GithubIcon className="w-5 h-5" />
              View on GitHub
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-12 border-t border-[var(--border)]">
            <div>
              <div className="text-4xl font-azeret font-bold text-[var(--accent)] mb-2">
                <CountUp end={25} suffix="+" />
              </div>
              <div className="text-sm text-[var(--muted)]">Components</div>
            </div>
            <div>
              <div className="text-4xl font-azeret font-bold text-[var(--accent)] mb-2">
                <CountUp end={100} suffix="%" />
              </div>
              <div className="text-sm text-[var(--muted)]">TypeScript</div>
            </div>
            <div>
              <div className="text-4xl font-azeret font-bold text-[var(--accent)] mb-2">
                <CountUp end={5.5} decimals={1} suffix="x" />
              </div>
              <div className="text-sm text-[var(--muted)]">Token Savings</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-1">
              <UIUniverseWordmark className="text-2xl mb-4" />
              <p className="text-sm text-[var(--muted)]">
                AI-native motion components for React & Next.js
              </p>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-[var(--muted)]">
                <li>
                  <a
                    href="/animations/fade-up"
                    className="hover:text-[var(--accent)] transition-colors"
                  >
                    Components
                  </a>
                </li>
                <li>
                  <a href="/evals" className="hover:text-[var(--accent)] transition-colors">
                    Eval Results
                  </a>
                </li>
                <li>
                  <a href="/evals/compare" className="hover:text-[var(--accent)] transition-colors">
                    Live Comparisons
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-sm text-[var(--muted)]">
                <li>
                  <a
                    href="https://github.com/Sdunga1/ui-universe"
                    className="hover:text-[var(--accent)] transition-colors"
                  >
                    GitHub
                  </a>
                </li>
                <li>
                  <a
                    href="https://x.com/uiUniverse_dev"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[var(--accent)] transition-colors"
                  >
                    Twitter / X
                  </a>
                </li>
                <li>
                  <a
                    href="https://linkedin.com/company/uiuniverse"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[var(--accent)] transition-colors"
                  >
                    LinkedIn
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-[var(--border)] flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-[var(--muted)]">
              &copy; 2026 uiUniverse. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a
                href="https://github.com/Sdunga1/ui-universe"
                className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
              >
                <GithubIcon className="w-5 h-5" />
              </a>
              <a
                href="https://x.com/uiUniverse_dev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
              >
                <TwitterIcon className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com/company/uiuniverse"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
              >
                <LinkedInIcon className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

function CountUp({
  end,
  suffix = "",
  decimals = 0,
  duration = 2000,
}: {
  end: number;
  suffix?: string;
  decimals?: number;
  duration?: number;
}) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  const animate = useCallback(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - (1 - progress) ** 3;
      setValue(eased * end);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [end, duration]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) animate();
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [animate]);

  return (
    <span ref={ref}>
      {value.toFixed(decimals)}
      {suffix}
    </span>
  );
}
