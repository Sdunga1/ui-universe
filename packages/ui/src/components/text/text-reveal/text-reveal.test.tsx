import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TextReveal } from "./text-reveal";

// Mock motion/react
vi.mock("motion/react", () => ({
  motion: {
    span: vi.fn().mockImplementation(({ children, style, ...props }) => (
      <span data-testid="motion-span" style={style} {...props}>
        {children}
      </span>
    )),
  },
}));

// Mock scroll progress to return 0 (start)
vi.mock("../../../hooks/use-scroll-progress", () => ({
  useScrollProgress: () => 0,
}));

describe("TextReveal", () => {
  it("renders the full text content", () => {
    render(<TextReveal text="Hello World" />);
    expect(screen.getByLabelText("Hello World")).toBeInTheDocument();
  });

  it("splits text into words by default", () => {
    render(<TextReveal text="One Two Three" />);
    const spans = screen.getAllByTestId("motion-span");
    expect(spans).toHaveLength(3);
  });

  it("splits text into characters", () => {
    render(<TextReveal text="Hi" splitBy="character" />);
    const spans = screen.getAllByTestId("motion-span");
    expect(spans).toHaveLength(2);
  });

  it("applies custom className", () => {
    render(<TextReveal text="Test" className="text-4xl" />);
    const el = screen.getByLabelText("Test");
    expect(el.className).toContain("text-4xl");
  });

  it("sets data-component attribute", () => {
    render(<TextReveal text="Test" />);
    const el = screen.getByLabelText("Test");
    expect(el).toHaveAttribute("data-component", "text-reveal");
  });

  it("passes through data attributes", () => {
    render(<TextReveal text="Test" data-section="manifesto" />);
    const el = screen.getByLabelText("Test");
    expect(el).toHaveAttribute("data-section", "manifesto");
  });

  it("sets data-index on each piece", () => {
    render(<TextReveal text="A B C" />);
    const spans = screen.getAllByTestId("motion-span");
    expect(spans[0]).toHaveAttribute("data-index", "0");
    expect(spans[1]).toHaveAttribute("data-index", "1");
    expect(spans[2]).toHaveAttribute("data-index", "2");
  });
});
