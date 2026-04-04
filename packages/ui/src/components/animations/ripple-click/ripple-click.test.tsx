import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { RippleClick } from "./ripple-click";

vi.mock("motion/react", () => ({
  motion: {
    span: vi
      .fn()
      .mockImplementation(({ children, initial, animate, exit, transition, style, ...props }) => (
        <span data-testid="ripple-span" style={style} {...props}>
          {children}
        </span>
      )),
  },
  AnimatePresence: vi.fn().mockImplementation(({ children }) => <>{children}</>),
}));

describe("RippleClick", () => {
  it("renders children", () => {
    render(
      <RippleClick>
        <button type="button">Click me</button>
      </RippleClick>,
    );
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(
      <RippleClick className="rounded-lg">
        <span>Content</span>
      </RippleClick>,
    );
    const wrapper = screen.getByText("Content").parentElement;
    expect(wrapper?.className).toContain("rounded-lg");
  });

  it("sets data-ripple-click attribute", () => {
    render(
      <RippleClick>
        <span>Content</span>
      </RippleClick>,
    );
    const wrapper = screen.getByText("Content").parentElement;
    expect(wrapper).toHaveAttribute("data-ripple-click");
  });

  it("has overflow-hidden class", () => {
    render(
      <RippleClick>
        <span>Content</span>
      </RippleClick>,
    );
    const wrapper = screen.getByText("Content").parentElement;
    expect(wrapper?.className).toContain("overflow-hidden");
  });

  it("passes through data attributes", () => {
    render(
      <RippleClick data-action="select">
        <span>Content</span>
      </RippleClick>,
    );
    const wrapper = screen.getByText("Content").parentElement;
    expect(wrapper).toHaveAttribute("data-action", "select");
  });
});
