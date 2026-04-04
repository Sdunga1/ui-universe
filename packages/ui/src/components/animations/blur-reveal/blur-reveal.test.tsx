import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { BlurReveal } from "./blur-reveal";

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

describe("BlurReveal", () => {
  it("renders children", () => {
    render(
      <BlurReveal triggerOnView={false}>
        <span>Hello</span>
      </BlurReveal>,
    );
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(
      <BlurReveal triggerOnView={false} className="mt-8">
        <span>Content</span>
      </BlurReveal>,
    );
    const wrapper = screen.getByTestId("motion-div");
    expect(wrapper.className).toContain("mt-8");
  });

  it("passes through additional props", () => {
    render(
      <BlurReveal triggerOnView={false} data-section="hero">
        <span>Content</span>
      </BlurReveal>,
    );
    const wrapper = screen.getByTestId("motion-div");
    expect(wrapper).toHaveAttribute("data-section", "hero");
  });
});
