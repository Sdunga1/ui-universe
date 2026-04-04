import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { GradientText } from "./gradient-text";

// Mock motion/react to avoid animation complexities in tests
vi.mock("motion/react", () => ({
  motion: {
    span: vi.fn().mockImplementation(({ children, initial, animate, ...props }) => (
      <span data-testid="motion-span" {...props}>
        {children}
      </span>
    )),
  },
}));

describe("GradientText", () => {
  it("renders children text", () => {
    render(<GradientText>Hello World</GradientText>);
    expect(screen.getByText("Hello World")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<GradientText className="text-4xl">Test</GradientText>);
    const el = screen.getByText("Test");
    expect(el.className).toContain("text-4xl");
  });

  it("sets data-component attribute", () => {
    render(<GradientText>Test</GradientText>);
    const el = screen.getByText("Test");
    expect(el).toHaveAttribute("data-component", "gradient-text");
  });

  it("applies gradient styles", () => {
    render(<GradientText>Test</GradientText>);
    const el = screen.getByText("Test");
    expect(el.style.backgroundClip).toBe("text");
    expect(el.style.color).toBe("transparent");
  });

  it("passes through data attributes", () => {
    render(<GradientText data-section="hero">Test</GradientText>);
    const el = screen.getByText("Test");
    expect(el).toHaveAttribute("data-section", "hero");
  });

  it("applies id attribute", () => {
    render(<GradientText id="brand-text">Test</GradientText>);
    const el = screen.getByText("Test");
    expect(el).toHaveAttribute("id", "brand-text");
  });
});
