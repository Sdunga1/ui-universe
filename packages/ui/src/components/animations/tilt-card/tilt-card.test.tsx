import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TiltCard } from "./tilt-card";

vi.mock("motion/react", () => ({
  motion: {
    div: vi.fn().mockImplementation(({ children, animate, transition, style, ...props }) => (
      <div data-testid="motion-div" {...props}>
        {children}
      </div>
    )),
  },
}));

describe("TiltCard", () => {
  it("renders children", () => {
    render(
      <TiltCard>
        <p>Card content</p>
      </TiltCard>,
    );
    expect(screen.getByText("Card content")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(
      <TiltCard className="w-80">
        <p>Content</p>
      </TiltCard>,
    );
    const wrapper = screen.getByTestId("motion-div").parentElement;
    expect(wrapper?.className).toContain("w-80");
  });

  it("sets data-tilt-card attribute", () => {
    render(
      <TiltCard>
        <p>Content</p>
      </TiltCard>,
    );
    const wrapper = screen.getByTestId("motion-div").parentElement;
    expect(wrapper).toHaveAttribute("data-tilt-card");
  });

  it("applies perspective style", () => {
    render(
      <TiltCard perspective={800}>
        <p>Content</p>
      </TiltCard>,
    );
    const wrapper = screen.getByTestId("motion-div").parentElement;
    expect(wrapper?.style.perspective).toBe("800px");
  });

  it("passes through data attributes", () => {
    render(
      <TiltCard data-card="pricing">
        <p>Content</p>
      </TiltCard>,
    );
    const wrapper = screen.getByTestId("motion-div").parentElement;
    expect(wrapper).toHaveAttribute("data-card", "pricing");
  });
});
