import { notFound } from "next/navigation";
import { ComponentPreview } from "../../../../components/component-preview";
import { getAllSlugs, getComponentBySlug } from "../../../../lib/registry";

interface PageProps {
  params: Promise<{
    category: string;
    component: string;
  }>;
}

export async function generateStaticParams() {
  return getAllSlugs();
}

export default async function ComponentPage({ params }: PageProps) {
  const { category, component: slug } = await params;
  const descriptor = getComponentBySlug(category, slug);

  if (!descriptor) {
    notFound();
  }

  return (
    <article className="max-w-3xl">
      <header className="mb-10">
        <p className="mb-2 text-sm font-medium capitalize text-[var(--accent)]">
          {descriptor.category}
        </p>
        <h1 className="text-4xl font-bold tracking-tight">{descriptor.name}</h1>
        <p className="mt-3 text-lg text-[var(--muted)]">{descriptor.description}</p>
        {/* Version & Stack */}
        <div className="mt-3 flex flex-wrap items-center gap-3">
          {descriptor.version && (
            <span className="rounded-none border border-[var(--border)] px-2 py-0.5 text-xs text-[var(--muted)]">
              v{descriptor.version}
            </span>
          )}
          {descriptor.supportedStack &&
            Object.entries(descriptor.supportedStack).map(([lib, range]) => (
              <span
                key={lib}
                className="rounded-none bg-[var(--card)] px-2 py-0.5 text-xs text-[var(--muted)]"
              >
                {lib} {range}
              </span>
            ))}
        </div>

        {descriptor.tags && descriptor.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {descriptor.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-none border border-[var(--border)] px-3 py-1 text-xs text-[var(--muted)]"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* Preview */}
      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold">Preview</h2>
        <ComponentPreview name={descriptor.name} category={descriptor.category} />
      </section>

      {/* Props Table */}
      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold">Props</h2>
        <div className="overflow-x-auto rounded-none border border-[var(--border)]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] text-left">
                <th className="px-4 py-3 font-medium text-[var(--muted)]">Prop</th>
                <th className="px-4 py-3 font-medium text-[var(--muted)]">Type</th>
                <th className="px-4 py-3 font-medium text-[var(--muted)]">Default</th>
                <th className="px-4 py-3 font-medium text-[var(--muted)]">Description</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(descriptor.props).map(([name, prop]) => (
                <tr key={name} className="border-b border-[var(--border)] last:border-0">
                  <td className="px-4 py-3">
                    <code className="rounded-none bg-[var(--card)] px-1.5 py-0.5 text-xs">
                      {name}
                      {prop.required && <span className="text-red-400">*</span>}
                    </code>
                  </td>
                  <td className="px-4 py-3 text-[var(--muted)]">
                    <code className="text-xs">{prop.type}</code>
                  </td>
                  <td className="px-4 py-3 text-[var(--muted)]">
                    <code className="text-xs">
                      {prop.default !== undefined ? String(prop.default) : "—"}
                    </code>
                  </td>
                  <td className="px-4 py-3 text-[var(--muted)]">{prop.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Slots */}
      {descriptor.slots && descriptor.slots.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-4 text-xl font-semibold">Slots</h2>
          <div className="overflow-x-auto rounded-none border border-[var(--border)]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] text-left">
                  <th className="px-4 py-3 font-medium text-[var(--muted)]">Slot</th>
                  <th className="px-4 py-3 font-medium text-[var(--muted)]">Type</th>
                  <th className="px-4 py-3 font-medium text-[var(--muted)]">Required</th>
                  <th className="px-4 py-3 font-medium text-[var(--muted)]">Description</th>
                </tr>
              </thead>
              <tbody>
                {descriptor.slots.map((slot) => (
                  <tr key={slot.name} className="border-b border-[var(--border)] last:border-0">
                    <td className="px-4 py-3">
                      <code className="rounded-none bg-[var(--card)] px-1.5 py-0.5 text-xs">
                        {slot.name}
                      </code>
                    </td>
                    <td className="px-4 py-3 text-[var(--muted)]">
                      <code className="text-xs">{slot.type}</code>
                    </td>
                    <td className="px-4 py-3 text-[var(--muted)]">
                      {slot.required ? "Yes" : "No"}
                    </td>
                    <td className="px-4 py-3 text-[var(--muted)]">{slot.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Layout Info */}
      {descriptor.layout && (
        <section className="mb-10">
          <h2 className="mb-4 text-xl font-semibold">Layout</h2>
          <div className="rounded-none border border-[var(--border)] bg-[var(--card)] p-4 text-sm">
            <div className="flex flex-wrap gap-4">
              {descriptor.layout.display && (
                <div>
                  <span className="text-[var(--muted)]">Display: </span>
                  <code className="text-xs">{descriptor.layout.display}</code>
                </div>
              )}
              {descriptor.layout.responsive !== undefined && (
                <div>
                  <span className="text-[var(--muted)]">Responsive: </span>
                  <span>{descriptor.layout.responsive ? "Yes" : "No"}</span>
                </div>
              )}
            </div>
            {descriptor.layout.description && (
              <p className="mt-2 text-[var(--muted)]">{descriptor.layout.description}</p>
            )}
          </div>
        </section>
      )}

      {/* Examples */}
      {descriptor.examples && descriptor.examples.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-4 text-xl font-semibold">Examples</h2>
          <div className="space-y-6">
            {descriptor.examples.map((example) => (
              <div key={example.title}>
                <h3 className="mb-2 text-sm font-medium text-[var(--muted)]">{example.title}</h3>
                <pre className="overflow-x-auto rounded-none border border-[var(--border)] bg-[var(--card)] p-4">
                  <code className="text-sm">{example.code}</code>
                </pre>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* AI Hint */}
      {descriptor.aiPromptHint && (
        <section className="mb-10">
          <h2 className="mb-4 text-xl font-semibold">AI Usage Hint</h2>
          <div className="rounded-none border border-[var(--border)] bg-[var(--card)] p-4 text-sm text-[var(--muted)]">
            {descriptor.aiPromptHint}
          </div>
        </section>
      )}

      {/* Recommended With */}
      {descriptor.recommendedWith && descriptor.recommendedWith.length > 0 && (
        <section>
          <h2 className="mb-4 text-xl font-semibold">Works Well With</h2>
          <div className="flex flex-wrap gap-2">
            {descriptor.recommendedWith.map((name) => (
              <span
                key={name}
                className="rounded-none border border-[var(--border)] px-3 py-1.5 text-sm"
              >
                {name}
              </span>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
