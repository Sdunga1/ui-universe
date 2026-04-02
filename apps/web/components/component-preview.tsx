"use client";

interface ComponentPreviewProps {
  name: string;
}

export function ComponentPreview({ name }: ComponentPreviewProps) {
  // Phase 1: Static preview placeholder
  // Phase 2: This will dynamically render the actual component with Lab Mode controls
  return (
    <div className="flex min-h-[200px] items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--card)]">
      <p className="text-sm text-[var(--muted)]">
        Live preview for <code className="font-mono">{name}</code> — coming in Lab Mode
      </p>
    </div>
  );
}
