import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MagneticHover } from "./magnetic-hover";

vi.mock("motion/react", () => ({
  motion: {
    div: vi.fn().mockImplementation(({ children, animate, transition, ...props }) => (
      <div data-testid="motion-div" {...props}>
        {children}
      </div>
    )),
  },
}));

describe("MagneticHover", () => {
  it("renders children", () => {
    render(
      <MagneticHover>
        <button type="button">Click me</button>
      </MagneticHover>,
    );
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(
      <MagneticHover className="my-class">
        <span>Content</span>
      </MagneticHover>,
    );
    const wrapper = screen.getByTestId("motion-div");
    expect(wrapper.className).toContain("my-class");
  });

  it("sets data-magnetic-hover attribute", () => {
    render(
      <MagneticHover>
        <span>Content</span>
      </MagneticHover>,
    );
    const wrapper = screen.getByTestId("motion-div");
    expect(wrapper).toHaveAttribute("data-magnetic-hover");
  });

  it("passes through data attributes", () => {
    render(
      <MagneticHover data-section="cta">
        <span>Content</span>
      </MagneticHover>,
    );
    const wrapper = screen.getByTestId("motion-div");
    expect(wrapper).toHaveAttribute("data-section", "cta");
  });

  it("applies id prop", () => {
    render(
      <MagneticHover id="mag-btn">
        <span>Content</span>
      </MagneticHover>,
    );
    const wrapper = screen.getByTestId("motion-div");
    expect(wrapper).toHaveAttribute("id", "mag-btn");
  });
});
