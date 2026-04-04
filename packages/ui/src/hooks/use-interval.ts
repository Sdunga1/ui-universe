"use client";

import { useEffect, useRef } from "react";

/**
 * Declarative setInterval hook with automatic cleanup.
 * Pass `null` as delay to pause the interval.
 *
 * Used by: TypeWriter, Counter
 */
export function useInterval(callback: () => void, delay: number | null): void {
  const savedCallback = useRef<() => void>(callback);

  // Remember the latest callback
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval
  useEffect(() => {
    if (delay === null) return;

    const id = setInterval(() => {
      savedCallback.current();
    }, delay);

    return () => clearInterval(id);
  }, [delay]);
}
