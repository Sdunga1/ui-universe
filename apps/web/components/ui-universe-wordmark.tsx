interface WordmarkProps {
  className?: string;
}

export function UIUniverseWordmark({ className = "" }: WordmarkProps) {
  return (
    <span
      className={`inline-flex items-center font-azeret font-bold tracking-tight leading-none ${className}`}
    >
      ui
      {/*
        Exact path from /public/logo.svg — same stroke, same circle, same colors.
        viewBox is cropped tightly to the content bounding box (no extra whitespace)
        so it sits flush at letter height without overflowing.
      */}
      <svg
        viewBox="8 5 30 30"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        style={{
          height: "1em",
          width: "auto",
          display: "inline-block",
          transform: "translateY(-0.08em)",
        }}
      >
        <g
          transform="translate(6,6)"
          stroke="#ee502c"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M 4,4 A 12,12 0 0 0 28,4 L 28,16 A 12,12 0 0 1 4,16 Z" />
          <circle cx="28" cy="16" r="2.5" fill="#ee502c" stroke="none" />
        </g>
      </svg>
      niverse
    </span>
  );
}
