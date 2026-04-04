import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { GradientMesh } from "./gradient-mesh";

vi.mock("../../../hooks/use-reduced-motion", () => ({
  useReducedMotion: () => false,
}));

describe("GradientMesh", () => {
  it("renders with the gradient-mesh data attribute", () => {
    render(<GradientMesh data-testid="gradient-mesh" />);
    const el = screen.getByTestId("gradient-mesh");
    expect(el).toBeInTheDocument();
    expect(el).toHaveAttribute("data-component", "gradient-mesh");
  });

  it("applies custom className", () => {
    render(<GradientMesh className="opacity-75" data-testid="gradient-mesh" />);
    const el = screen.getByTestId("gradient-mesh");
    expect(el.className).toContain("opacity-75");
  });

  it("sets aria-hidden to true", () => {
    render(<GradientMesh data-testid="gradient-mesh" />);
    const el = screen.getByTestId("gradient-mesh");
    expect(el).toHaveAttribute("aria-hidden", "true");
  });

  it("renders one blob per color", () => {
    const colors = ["#ff0000", "#00ff00", "#0000ff"];
    render(<GradientMesh colors={colors} data-testid="gradient-mesh" />);
    const container = screen.getByTestId("gradient-mesh");
    expect(container.children).toHaveLength(colors.length);
  });

  it("passes through data attributes", () => {
    render(<GradientMesh data-testid="gradient-mesh" data-section="hero" />);
    const el = screen.getByTestId("gradient-mesh");
    expect(el).toHaveAttribute("data-section", "hero");
  });
});
