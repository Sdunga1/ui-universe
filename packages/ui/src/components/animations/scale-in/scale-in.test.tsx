import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ScaleIn } from "./scale-in";

// Mock motion/react to avoid animation complexities in tests
vi.mock("motion/react", () => ({
  motion: {
    div: vi.fn().mockImplementation(({ children, initial, animate, ...props }) => (
      <div data-testid="motion-div" {...props}>
        {children}
      </div>
    )),
  },
}));

describe("ScaleIn", () => {
  it("renders children", () => {
    render(
      <ScaleIn triggerOnView={false}>
        <span>Hello</span>
      </ScaleIn>,
    );
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(
      <ScaleIn triggerOnView={false} className="mt-8">
        <span>Content</span>
      </ScaleIn>,
    );
    const wrapper = screen.getByTestId("motion-div");
    expect(wrapper.className).toContain("mt-8");
  });

  it("passes through additional props", () => {
    render(
      <ScaleIn triggerOnView={false} data-section="hero">
        <span>Content</span>
      </ScaleIn>,
    );
    const wrapper = screen.getByTestId("motion-div");
    expect(wrapper).toHaveAttribute("data-section", "hero");
  });
});
