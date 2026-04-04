import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TypeWriter } from "./type-writer";

// Mock hooks to simplify test environment
vi.mock("../../../hooks/use-reduced-motion", () => ({
  useReducedMotion: () => true, // Default to reduced motion for predictable tests
}));

describe("TypeWriter", () => {
  it("renders full text when reduced motion is preferred", () => {
    render(<TypeWriter text="Hello World" />);
    expect(screen.getByText("Hello World")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<TypeWriter text="Test" className="font-mono" />);
    const el = screen.getByLabelText(/./);
    expect(el.className).toContain("font-mono");
  });

  it("sets data-component attribute", () => {
    render(<TypeWriter text="Test" />);
    const el = screen.getByLabelText(/./);
    expect(el).toHaveAttribute("data-component", "type-writer");
  });

  it("sets aria-label to full text", () => {
    render(<TypeWriter text="Accessible text" />);
    const el = screen.getByLabelText(/./);
    expect(el).toHaveAttribute("aria-label", "Accessible text");
  });

  it("hides cursor in reduced motion mode", () => {
    render(<TypeWriter text="Test" cursor />);
    const cursor = document.querySelector(".uiu-type-writer-cursor");
    expect(cursor).toBeNull();
  });

  it("passes through data attributes", () => {
    render(<TypeWriter text="Test" data-section="hero" />);
    const el = screen.getByLabelText(/./);
    expect(el).toHaveAttribute("data-section", "hero");
  });

  it("applies id attribute", () => {
    render(<TypeWriter text="Test" id="headline" />);
    const el = screen.getByLabelText(/./);
    expect(el).toHaveAttribute("id", "headline");
  });
});
