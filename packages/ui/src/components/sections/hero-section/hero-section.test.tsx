import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { HeroSection } from "./hero-section";

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

describe("HeroSection", () => {
  it("renders heading", () => {
    render(<HeroSection heading={<h1>Hello World</h1>} />);
    expect(screen.getByText("Hello World")).toBeInTheDocument();
  });

  it("renders subheading when provided", () => {
    render(<HeroSection heading={<h1>Title</h1>} subheading={<p>Subtitle text</p>} />);
    expect(screen.getByText("Subtitle text")).toBeInTheDocument();
  });

  it("renders CTA when provided", () => {
    render(
      <HeroSection heading={<h1>Title</h1>} cta={<button type="button">Get Started</button>} />,
    );
    expect(screen.getByText("Get Started")).toBeInTheDocument();
  });

  it("renders visual when provided", () => {
    render(
      <HeroSection heading={<h1>Title</h1>} visual={<img alt="Hero visual" src="/hero.png" />} />,
    );
    expect(screen.getByAltText("Hero visual")).toBeInTheDocument();
  });

  it("applies data-component attribute", () => {
    const { container } = render(<HeroSection heading={<h1>Title</h1>} />);
    const section = container.querySelector("[data-component='hero-section']");
    expect(section).toBeInTheDocument();
  });

  it("applies data-align attribute", () => {
    const { container } = render(<HeroSection heading={<h1>Title</h1>} align="left" />);
    const section = container.querySelector("[data-align='left']");
    expect(section).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(<HeroSection heading={<h1>Title</h1>} className="bg-black" />);
    const section = container.querySelector("[data-component='hero-section']");
    expect(section?.className).toContain("bg-black");
  });

  it("uses center alignment by default", () => {
    const { container } = render(<HeroSection heading={<h1>Title</h1>} />);
    const section = container.querySelector("[data-align='center']");
    expect(section).toBeInTheDocument();
  });

  it("uses grid layout for left alignment", () => {
    const { container } = render(<HeroSection heading={<h1>Title</h1>} align="left" />);
    const section = container.querySelector("[data-component='hero-section']");
    expect(section?.className).toContain("grid");
  });

  it("passes through data attributes", () => {
    const { container } = render(<HeroSection heading={<h1>Title</h1>} data-section="hero" />);
    const section = container.querySelector("[data-component='hero-section']");
    expect(section).toHaveAttribute("data-section", "hero");
  });
});
