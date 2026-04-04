import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { FeatureGrid } from "./feature-grid";

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

describe("FeatureGrid", () => {
  it("renders children", () => {
    render(
      <FeatureGrid>
        <div>Card 1</div>
        <div>Card 2</div>
        <div>Card 3</div>
      </FeatureGrid>,
    );
    expect(screen.getByText("Card 1")).toBeInTheDocument();
    expect(screen.getByText("Card 2")).toBeInTheDocument();
    expect(screen.getByText("Card 3")).toBeInTheDocument();
  });

  it("applies data-component attribute", () => {
    const { container } = render(
      <FeatureGrid>
        <div>Card</div>
      </FeatureGrid>,
    );
    const section = container.querySelector("[data-component='feature-grid']");
    expect(section).toBeInTheDocument();
  });

  it("applies data-columns attribute", () => {
    const { container } = render(
      <FeatureGrid columns={4}>
        <div>Card</div>
      </FeatureGrid>,
    );
    const section = container.querySelector("[data-columns='4']");
    expect(section).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <FeatureGrid className="bg-black">
        <div>Card</div>
      </FeatureGrid>,
    );
    const section = container.querySelector("[data-component='feature-grid']");
    expect(section?.className).toContain("bg-black");
  });

  it("defaults to 3 columns", () => {
    const { container } = render(
      <FeatureGrid>
        <div>Card</div>
      </FeatureGrid>,
    );
    const section = container.querySelector("[data-columns='3']");
    expect(section).toBeInTheDocument();
  });

  it("passes through data attributes", () => {
    const { container } = render(
      <FeatureGrid data-section="features">
        <div>Card</div>
      </FeatureGrid>,
    );
    const section = container.querySelector("[data-component='feature-grid']");
    expect(section).toHaveAttribute("data-section", "features");
  });
});
