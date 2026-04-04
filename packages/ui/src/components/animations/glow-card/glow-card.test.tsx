import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { GlowCard } from "./glow-card";

vi.mock("motion/react", () => ({
  motion: {
    div: vi.fn().mockImplementation(({ children, animate, transition, style, ...props }) => (
      <div data-testid="motion-div" style={style} {...props}>
        {children}
      </div>
    )),
  },
}));

describe("GlowCard", () => {
  it("renders children", () => {
    render(
      <GlowCard>
        <p>Card content</p>
      </GlowCard>,
    );
    expect(screen.getByText("Card content")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(
      <GlowCard className="w-80">
        <p>Content</p>
      </GlowCard>,
    );
    const wrapper = screen.getByText("Content").closest("[data-glow-card]");
    expect(wrapper?.className).toContain("w-80");
  });

  it("sets data-glow-card attribute", () => {
    render(
      <GlowCard>
        <p>Content</p>
      </GlowCard>,
    );
    const wrapper = screen.getByText("Content").closest("[data-glow-card]");
    expect(wrapper).toHaveAttribute("data-glow-card");
  });

  it("applies custom border radius", () => {
    render(
      <GlowCard borderRadius="2rem">
        <p>Content</p>
      </GlowCard>,
    );
    const wrapper = screen.getByText("Content").closest("[data-glow-card]") as HTMLElement;
    expect(wrapper?.style.borderRadius).toBe("2rem");
  });

  it("passes through data attributes", () => {
    render(
      <GlowCard data-card="feature">
        <p>Content</p>
      </GlowCard>,
    );
    const wrapper = screen.getByText("Content").closest("[data-glow-card]");
    expect(wrapper).toHaveAttribute("data-card", "feature");
  });
});
