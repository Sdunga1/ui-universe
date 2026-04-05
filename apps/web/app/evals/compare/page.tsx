import Link from "next/link";
import { CATEGORIES, COMPONENTS } from "../../../lib/eval-compare-components";

const categoryLabels: Record<string, string> = {
  text: "Text",
  backgrounds: "Backgrounds",
  sections: "Sections",
};

export default function ComparePage() {
  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-2">
        <Link
          href="/evals"
          className="text-xs text-[var(--muted)] hover:text-white transition-colors"
        >
          ← Back to Evals
        </Link>
      </div>
      <h1 className="text-3xl font-bold mt-3 mb-2">Live Comparisons</h1>
      <p className="text-[var(--muted)] mb-8 text-sm">
        See AI-generated components side-by-side:{" "}
        <strong className="text-emerald-400">raw source</strong> (AI saw full component code) vs{" "}
        <strong className="text-[var(--accent)]">descriptor</strong> (AI saw only the JSON
        descriptor). Same quality, 6x fewer tokens.
      </p>

      {CATEGORIES.map((cat) => {
        const items = COMPONENTS.filter((c) => c.category === cat);
        if (items.length === 0) return null;

        return (
          <div key={cat} className="mb-8">
            <h2 className="text-[10px] uppercase tracking-widest text-[var(--muted)] mb-3">
              {categoryLabels[cat]}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {items.map((comp) => (
                <Link
                  key={comp.slug}
                  href={`/evals/compare/${comp.slug}`}
                  className="block p-5 border border-[var(--border)] bg-[var(--card)] hover:border-[var(--accent)] transition-colors"
                >
                  <h3 className="font-semibold mb-1">{comp.name}</h3>
                  <p className="text-xs text-[var(--muted)]">{comp.category}</p>
                </Link>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
