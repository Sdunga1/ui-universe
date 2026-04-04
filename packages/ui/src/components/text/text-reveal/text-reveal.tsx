"use client";

import { motion } from "motion/react";
import { forwardRef, useMemo, useRef } from "react";
import { useReducedMotion } from "../../../hooks/use-reduced-motion";
import { useScrollProgress } from "../../../hooks/use-scroll-progress";
import { cn } from "../../../lib/utils";

export type TextRevealSplitBy = "word" | "line" | "character";

export interface TextRevealProps {
  /** The text to progressively reveal on scroll. */
  text: string;
  /** How to split the text for staggered reveal. */
  splitBy?: TextRevealSplitBy;
  /** Additional Tailwind classes. */
  className?: string;
  /** HTML id attribute. */
  id?: string;
  /** Custom data attributes or aria attributes. */
  [key: `data-${string}`]: string | undefined;
  [key: `aria-${string}`]: string | undefined;
}

function splitText(text: string, splitBy: TextRevealSplitBy): string[] {
  switch (splitBy) {
    case "line":
      return text.split("\n").filter(Boolean);
    case "character":
      return text.split("");
    default:
      return text.split(/\s+/).filter(Boolean);
  }
}

export const TextReveal = forwardRef<HTMLDivElement, TextRevealProps>(
  ({ text, splitBy = "word", className, id, ...rest }, forwardedRef) => {
    const internalRef = useRef<HTMLDivElement>(null);
    const ref = (forwardedRef as React.RefObject<HTMLDivElement>) ?? internalRef;

    const prefersReducedMotion = useReducedMotion();
    const scrollProgress = useScrollProgress(ref);

    const pieces = useMemo(() => splitText(text, splitBy), [text, splitBy]);

    return (
      <div
        ref={ref}
        id={id}
        className={cn("uiu-text-reveal", className)}
        data-component="text-reveal"
        aria-label={text}
        {...rest}
      >
        {pieces.map((piece, i) => {
          // Map scroll progress (0-1) to each piece's opacity
          // Each piece gets a proportional slice of the total progress range
          const pieceStart = i / pieces.length;
          const pieceEnd = (i + 1) / pieces.length;
          const opacity = prefersReducedMotion
            ? 1
            : Math.min(1, Math.max(0.15, (scrollProgress - pieceStart) / (pieceEnd - pieceStart)));

          return (
            <motion.span
              key={`${piece}-at-${String(i)}`}
              style={{ opacity }}
              className="uiu-text-reveal-piece"
              data-index={i}
            >
              {piece}
              {splitBy === "word" && i < pieces.length - 1 ? " " : ""}
              {splitBy === "line" && i < pieces.length - 1 ? <br /> : ""}
            </motion.span>
          );
        })}
      </div>
    );
  },
);

TextReveal.displayName = "TextReveal";
