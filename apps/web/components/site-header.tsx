import Image from "next/image";
import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight">
          <Image src="/logo.svg" alt="ui-universe" width={28} height={28} className="invert" />
          ui-universe
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link
            href="/animations/fade-up"
            className="text-[var(--muted)] transition-colors hover:text-white"
          >
            Components
          </Link>
          <a
            href="https://github.com/sarathkumardunga/ui-universe"
            className="text-[var(--muted)] transition-colors hover:text-white"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </nav>
      </div>
    </header>
  );
}
