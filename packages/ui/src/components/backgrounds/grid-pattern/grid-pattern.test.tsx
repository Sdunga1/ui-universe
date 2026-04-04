import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { GridPattern } from "./grid-pattern";

vi.mock("../../../hooks/use-reduced-motion", () => ({
  useReducedMotion: () => false,
}));

describe("GridPattern", () => {
  it("renders with the grid-pattern data attribute", () => {
    render(<GridPattern data-testid="grid-pattern" />);
    const el = screen.getByTestId("grid-pattern");
    expect(el).toBeInTheDocument();
    expect(el).toHaveAttribute("data-component", "grid-pattern");
  });

  it("applies custom className", () => {
    render(<GridPattern className="opacity-40" data-testid="grid-pattern" />);
    const el = screen.getByTestId("grid-pattern");
    expect(el.className).toContain("opacity-40");
  });

  it("sets aria-hidden to true", () => {
    render(<GridPattern data-testid="grid-pattern" />);
    const el = screen.getByTestId("grid-pattern");
    expect(el).toHaveAttribute("aria-hidden", "true");
  });

  it("renders an SVG element", () => {
    render(<GridPattern data-testid="grid-pattern" />);
    const container = screen.getByTestId("grid-pattern");
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("renders a pattern with the correct size", () => {
    render(<GridPattern size={48} data-testid="grid-pattern" />);
    const container = screen.getByTestId("grid-pattern");
    const pattern = container.querySelector("pattern");
    expect(pattern).toHaveAttribute("width", "48");
    expect(pattern).toHaveAttribute("height", "48");
  });

  it("passes through data attributes", () => {
    render(<GridPattern data-testid="grid-pattern" data-section="pricing" />);
    const el = screen.getByTestId("grid-pattern");
    expect(el).toHaveAttribute("data-section", "pricing");
  });
});
