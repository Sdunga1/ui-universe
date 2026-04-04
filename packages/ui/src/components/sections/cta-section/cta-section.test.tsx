import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CTASection } from "./cta-section";

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

describe("CTASection", () => {
  it("renders heading", () => {
    render(<CTASection heading={<h2>Ready to start?</h2>} />);
    expect(screen.getByText("Ready to start?")).toBeInTheDocument();
  });

  it("renders description when provided", () => {
    render(
      <CTASection heading={<h2>Title</h2>} description={<p>Join thousands of developers.</p>} />,
    );
    expect(screen.getByText("Join thousands of developers.")).toBeInTheDocument();
  });

  it("renders primary action when provided", () => {
    render(
      <CTASection
        heading={<h2>Title</h2>}
        primaryAction={<button type="button">Get Started</button>}
      />,
    );
    expect(screen.getByText("Get Started")).toBeInTheDocument();
  });

  it("renders secondary action when provided", () => {
    render(<CTASection heading={<h2>Title</h2>} secondaryAction={<a href="/docs">Read docs</a>} />);
    expect(screen.getByText("Read docs")).toBeInTheDocument();
  });

  it("renders both actions side by side", () => {
    render(
      <CTASection
        heading={<h2>Title</h2>}
        primaryAction={<button type="button">Primary</button>}
        secondaryAction={<button type="button">Secondary</button>}
      />,
    );
    expect(screen.getByText("Primary")).toBeInTheDocument();
    expect(screen.getByText("Secondary")).toBeInTheDocument();
  });

  it("applies data-component attribute", () => {
    const { container } = render(<CTASection heading={<h2>Title</h2>} />);
    const section = container.querySelector("[data-component='cta-section']");
    expect(section).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <CTASection heading={<h2>Title</h2>} className="bg-neutral-950" />,
    );
    const section = container.querySelector("[data-component='cta-section']");
    expect(section?.className).toContain("bg-neutral-950");
  });

  it("passes through data attributes", () => {
    const { container } = render(<CTASection heading={<h2>Title</h2>} data-section="cta" />);
    const section = container.querySelector("[data-component='cta-section']");
    expect(section).toHaveAttribute("data-section", "cta");
  });

  it("does not render actions wrapper when no actions provided", () => {
    const { container } = render(<CTASection heading={<h2>Title</h2>} />);
    // Only the heading FadeUp should render, no flex action container
    const section = container.querySelector("[data-component='cta-section']");
    const flexContainers = section?.querySelectorAll(".flex");
    // Should be 0 (no action buttons container)
    expect(flexContainers?.length ?? 0).toBe(0);
  });
});
