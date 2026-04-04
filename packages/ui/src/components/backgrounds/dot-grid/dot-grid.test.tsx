import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DotGrid } from "./dot-grid";

vi.mock("../../../hooks/use-reduced-motion", () => ({
  useReducedMotion: () => false,
}));

describe("DotGrid", () => {
  it("renders a div with the dot-grid data attribute", () => {
    render(<DotGrid data-testid="dot-grid" />);
    const el = screen.getByTestId("dot-grid");
    expect(el).toBeInTheDocument();
    expect(el).toHaveAttribute("data-component", "dot-grid");
  });

  it("applies custom className", () => {
    render(<DotGrid className="opacity-50" data-testid="dot-grid" />);
    const el = screen.getByTestId("dot-grid");
    expect(el.className).toContain("opacity-50");
  });

  it("sets aria-hidden to true", () => {
    render(<DotGrid data-testid="dot-grid" />);
    const el = screen.getByTestId("dot-grid");
    expect(el).toHaveAttribute("aria-hidden", "true");
  });

  it("passes through data attributes", () => {
    render(<DotGrid data-testid="dot-grid" data-section="hero" />);
    const el = screen.getByTestId("dot-grid");
    expect(el).toHaveAttribute("data-section", "hero");
  });

  it("renders with custom dot size and gap", () => {
    render(<DotGrid dotSize={2} gap={32} data-testid="dot-grid" />);
    const el = screen.getByTestId("dot-grid");
    expect(el.style.backgroundSize).toBe("32px 32px");
  });
});
