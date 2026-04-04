import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SlideIn } from "./slide-in";

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

describe("SlideIn", () => {
  it("renders children", () => {
    render(
      <SlideIn triggerOnView={false}>
        <span>Hello</span>
      </SlideIn>,
    );
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(
      <SlideIn triggerOnView={false} className="mt-8">
        <span>Content</span>
      </SlideIn>,
    );
    const wrapper = screen.getByTestId("motion-div");
    expect(wrapper.className).toContain("mt-8");
  });

  it("passes through additional props", () => {
    render(
      <SlideIn triggerOnView={false} data-section="hero">
        <span>Content</span>
      </SlideIn>,
    );
    const wrapper = screen.getByTestId("motion-div");
    expect(wrapper).toHaveAttribute("data-section", "hero");
  });

  it("renders with direction='right'", () => {
    render(
      <SlideIn triggerOnView={false} direction="right">
        <span>Right</span>
      </SlideIn>,
    );
    expect(screen.getByText("Right")).toBeInTheDocument();
  });

  it("renders with direction='up'", () => {
    render(
      <SlideIn triggerOnView={false} direction="up">
        <span>Up</span>
      </SlideIn>,
    );
    expect(screen.getByText("Up")).toBeInTheDocument();
  });

  it("renders with direction='down'", () => {
    render(
      <SlideIn triggerOnView={false} direction="down">
        <span>Down</span>
      </SlideIn>,
    );
    expect(screen.getByText("Down")).toBeInTheDocument();
  });
});
