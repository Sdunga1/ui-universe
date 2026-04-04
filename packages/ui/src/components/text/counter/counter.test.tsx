import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Counter } from "./counter";

// Mock hooks for predictable tests
vi.mock("../../../hooks/use-reduced-motion", () => ({
  useReducedMotion: () => true, // Reduced motion = show final value immediately
}));

vi.mock("../../../hooks/use-in-view", () => ({
  useInView: () => true,
}));

describe("Counter", () => {
  it("renders the target value in reduced motion mode", () => {
    render(<Counter to={1000} />);
    expect(screen.getByText("1,000")).toBeInTheDocument();
  });

  it("applies prefix and suffix", () => {
    render(<Counter to={500} prefix="$" suffix="+" />);
    expect(screen.getByText("$500+")).toBeInTheDocument();
  });

  it("formats with thousands separator", () => {
    render(<Counter to={1234567} />);
    expect(screen.getByText("1,234,567")).toBeInTheDocument();
  });

  it("shows decimal places", () => {
    render(<Counter to={99.9} decimals={1} />);
    expect(screen.getByText("99.9")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<Counter to={100} className="text-5xl" />);
    const el = screen.getByText("100");
    expect(el.className).toContain("text-5xl");
  });

  it("sets data-component attribute", () => {
    render(<Counter to={100} />);
    const el = screen.getByText("100");
    expect(el).toHaveAttribute("data-component", "counter");
  });

  it("sets aria-label to the final formatted value", () => {
    render(<Counter to={5000} prefix="$" />);
    const el = screen.getByText("$5,000");
    expect(el).toHaveAttribute("aria-label", "$5,000");
  });

  it("passes through data attributes", () => {
    render(<Counter to={100} data-stat="users" />);
    const el = screen.getByText("100");
    expect(el).toHaveAttribute("data-stat", "users");
  });

  it("uses tabular-nums class for stable digit widths", () => {
    render(<Counter to={100} />);
    const el = screen.getByText("100");
    expect(el.className).toContain("tabular-nums");
  });
});
