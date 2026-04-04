import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Aurora } from "./aurora";

vi.mock("../../../hooks/use-reduced-motion", () => ({
  useReducedMotion: () => false,
}));

describe("Aurora", () => {
  it("renders with the aurora data attribute", () => {
    render(<Aurora data-testid="aurora" />);
    const el = screen.getByTestId("aurora");
    expect(el).toBeInTheDocument();
    expect(el).toHaveAttribute("data-component", "aurora");
  });

  it("applies custom className", () => {
    render(<Aurora className="opacity-80" data-testid="aurora" />);
    const el = screen.getByTestId("aurora");
    expect(el.className).toContain("opacity-80");
  });

  it("sets aria-hidden to true", () => {
    render(<Aurora data-testid="aurora" />);
    const el = screen.getByTestId("aurora");
    expect(el).toHaveAttribute("aria-hidden", "true");
  });

  it("renders one layer per color", () => {
    const colors = ["#ff000040", "#00ff0040"];
    render(<Aurora colors={colors} data-testid="aurora" />);
    const container = screen.getByTestId("aurora");
    expect(container.children).toHaveLength(colors.length);
  });

  it("passes through data attributes", () => {
    render(<Aurora data-testid="aurora" data-section="hero" />);
    const el = screen.getByTestId("aurora");
    expect(el).toHaveAttribute("data-section", "hero");
  });
});
