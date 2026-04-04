"use client";

import dynamic from "next/dynamic";

interface ComponentPreviewProps {
  name: string;
  category: string;
}

function PreviewFallback() {
  return (
    <div className="flex min-h-[200px] items-center justify-center rounded-none border border-[var(--border)] bg-[var(--card)]">
      <p className="text-sm text-[var(--muted)]">Loading preview...</p>
    </div>
  );
}

const PreviewDemos = dynamic(() => import("./preview-demos"), {
  loading: () => <PreviewFallback />,
  ssr: false,
});

export function ComponentPreview({ name, category }: ComponentPreviewProps) {
  return (
    <div className="preview-ambient relative min-h-[200px] overflow-hidden rounded-none border border-[var(--border)]">
      <PreviewDemos name={name} category={category} />
    </div>
  );
}
