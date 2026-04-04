import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SplitText } from "./split-text";

// Mock motion/react
vi.mock("motion/react", () => ({
  motion: {
    span: vi.fn().mockImplementation(({ children, initial, animate, ...props }) => (
      <span data-testid="motion-span" {...props}>
        {children}
      </span>
    )),
  },
}));

// Mock hooks
vi.mock("../../../hooks/use-in-view", () => ({
  useInView: () => true,
}));

vi.mock("../../../hooks/use-reduced-motion", () => ({
  useReducedMotion: () => false,
}));

vi.mock("../../../hooks/use-motion-preset", () => ({
  useMotionPreset: () => ({
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: [0, 0, 0.2, 1] },
  }),
}));

describe("SplitText", () => {
  it("renders all non-space characters as motion spans", () => {
    render(<SplitText text="Hi" triggerOnView={false} />);
    const spans = screen.getAllByTestId("motion-span");
    expect(spans).toHaveLength(2);
    expect(spans[0]).toHaveTextContent("H");
    expect(spans[1]).toHaveTextContent("i");
  });

  it("preserves spaces as non-animated spans", () => {
    render(<SplitText text="A B" triggerOnView={false} />);
    const motionSpans = screen.getAllByTestId("motion-span");
    // Only 'A' and 'B' should be motion spans
    expect(motionSpans).toHaveLength(2);
  });

  it("applies custom className", () => {
    render(<SplitText text="Test" className="text-6xl" triggerOnView={false} />);
    const el = screen.getByLabelText("Test");
    expect(el.className).toContain("text-6xl");
  });

  it("sets data-component attribute", () => {
    render(<SplitText text="Test" triggerOnView={false} />);
    const el = screen.getByLabelText("Test");
    expect(el).toHaveAttribute("data-component", "split-text");
  });

  it("sets aria-label to full text", () => {
    render(<SplitText text="Hello World" triggerOnView={false} />);
    const el = screen.getByLabelText("Hello World");
    expect(el).toBeInTheDocument();
  });

  it("passes through data attributes", () => {
    render(<SplitText text="Test" data-section="hero" triggerOnView={false} />);
    const el = screen.getByLabelText("Test");
    expect(el).toHaveAttribute("data-section", "hero");
  });

  it("sets data-index on each character span", () => {
    render(<SplitText text="AB" triggerOnView={false} />);
    const spans = screen.getAllByTestId("motion-span");
    expect(spans[0]).toHaveAttribute("data-index", "0");
    expect(spans[1]).toHaveAttribute("data-index", "1");
  });
});
