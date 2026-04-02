import Image from "next/image";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="max-w-2xl text-center">
        <div className="mb-6 flex justify-center">
          <Image src="/logo.svg" alt="ui-universe" width={64} height={64} className="invert" />
        </div>
        <h1 className="text-5xl font-bold tracking-tight sm:text-7xl">ui-universe</h1>
        <p className="mt-6 text-lg text-[var(--muted)] sm:text-xl">
          AI-native motion UI components for React &amp; Next.js. Ship premium landing pages in
          minutes.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <a
            href="/animations/fade-up"
            className="rounded-lg bg-[var(--accent)] px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            Browse Components
          </a>
          <a
            href="https://github.com/sarathkumardunga/ui-universe"
            className="rounded-lg border border-[var(--border)] px-6 py-3 text-sm font-medium transition-colors hover:bg-[var(--card)]"
          >
            GitHub
          </a>
        </div>
      </div>
    </main>
  );
}
