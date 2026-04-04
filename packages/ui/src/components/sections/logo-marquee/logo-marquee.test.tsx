import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { LogoMarquee } from "./logo-marquee";

// Mock useReducedMotion
vi.mock("../../../hooks/use-reduced-motion", () => ({
  useReducedMotion: () => false,
}));

describe("LogoMarquee", () => {
  it("renders children", () => {
    render(
      <LogoMarquee>
        <span>Logo A</span>
        <span>Logo B</span>
      </LogoMarquee>,
    );
    // Children are duplicated for seamless loop, so there are 2 of each
    const logos = screen.getAllByText("Logo A");
    expect(logos.length).toBe(2);
  });

  it("applies data-component attribute", () => {
    const { container } = render(
      <LogoMarquee>
        <span>Logo</span>
      </LogoMarquee>,
    );
    const el = container.querySelector("[data-component='logo-marquee']");
    expect(el).toBeInTheDocument();
  });

  it("applies data-direction attribute", () => {
    const { container } = render(
      <LogoMarquee direction="right">
        <span>Logo</span>
      </LogoMarquee>,
    );
    const el = container.querySelector("[data-direction='right']");
    expect(el).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <LogoMarquee className="bg-neutral-950">
        <span>Logo</span>
      </LogoMarquee>,
    );
    const el = container.querySelector("[data-component='logo-marquee']");
    expect(el?.className).toContain("bg-neutral-950");
  });

  it("defaults to left direction", () => {
    const { container } = render(
      <LogoMarquee>
        <span>Logo</span>
      </LogoMarquee>,
    );
    const el = container.querySelector("[data-direction='left']");
    expect(el).toBeInTheDocument();
  });

  it("passes through data attributes", () => {
    const { container } = render(
      <LogoMarquee data-section="partners">
        <span>Logo</span>
      </LogoMarquee>,
    );
    const el = container.querySelector("[data-component='logo-marquee']");
    expect(el).toHaveAttribute("data-section", "partners");
  });

  it("includes overflow-hidden class", () => {
    const { container } = render(
      <LogoMarquee>
        <span>Logo</span>
      </LogoMarquee>,
    );
    const el = container.querySelector("[data-component='logo-marquee']");
    expect(el?.className).toContain("overflow-hidden");
  });
});
