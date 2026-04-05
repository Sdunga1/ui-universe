import Link from "next/link";
import { UIUniverseWordmark } from "./ui-universe-wordmark";

export function SiteHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/">
          <UIUniverseWordmark className="text-xl" />
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link
            href="/backgrounds/aurora"
            className="text-[var(--muted)] transition-colors hover:text-white"
          >
            Components
          </Link>
          <Link href="/evals" className="text-[var(--muted)] transition-colors hover:text-white">
            Evals
          </Link>
          <a
            href="https://github.com/Sdunga1/ui-universe"
            className="text-[var(--muted)] transition-colors hover:text-white"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          <a
            href="/animations/fade-up"
            className="hidden sm:inline-flex px-4 py-2 bg-[var(--accent)] text-white rounded-none text-sm font-medium hover:bg-[var(--accent-hover)] transition-all hover:scale-105"
          >
            Get Started
          </a>
        </nav>
      </div>
    </header>
  );
}
