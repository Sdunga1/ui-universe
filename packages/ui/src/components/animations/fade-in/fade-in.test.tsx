import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { FadeIn } from "./fade-in";

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

describe("FadeIn", () => {
  it("renders children", () => {
    render(
      <FadeIn triggerOnView={false}>
        <span>Hello</span>
      </FadeIn>,
    );
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(
      <FadeIn triggerOnView={false} className="mt-8">
        <span>Content</span>
      </FadeIn>,
    );
    const wrapper = screen.getByTestId("motion-div");
    expect(wrapper.className).toContain("mt-8");
  });

  it("passes through additional props", () => {
    render(
      <FadeIn triggerOnView={false} data-section="hero">
        <span>Content</span>
      </FadeIn>,
    );
    const wrapper = screen.getByTestId("motion-div");
    expect(wrapper).toHaveAttribute("data-section", "hero");
  });
});
