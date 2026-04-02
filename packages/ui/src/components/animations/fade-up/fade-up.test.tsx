import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { FadeUp } from "./fade-up";

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

describe("FadeUp", () => {
  it("renders children", () => {
    render(
      <FadeUp triggerOnView={false}>
        <span>Hello</span>
      </FadeUp>,
    );
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(
      <FadeUp triggerOnView={false} className="mt-8">
        <span>Content</span>
      </FadeUp>,
    );
    const wrapper = screen.getByTestId("motion-div");
    expect(wrapper.className).toContain("mt-8");
  });

  it("passes through additional props", () => {
    render(
      <FadeUp triggerOnView={false} data-section="hero">
        <span>Content</span>
      </FadeUp>,
    );
    const wrapper = screen.getByTestId("motion-div");
    expect(wrapper).toHaveAttribute("data-section", "hero");
  });
});
