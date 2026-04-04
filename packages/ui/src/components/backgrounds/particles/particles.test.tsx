import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Particles } from "./particles";

vi.mock("../../../hooks/use-reduced-motion", () => ({
  useReducedMotion: () => true,
}));

// Mock ResizeObserver
const observeMock = vi.fn();
const disconnectMock = vi.fn();
vi.stubGlobal(
  "ResizeObserver",
  vi.fn(() => ({
    observe: observeMock,
    unobserve: vi.fn(),
    disconnect: disconnectMock,
  })),
);

describe("Particles", () => {
  it("renders with the particles data attribute", () => {
    render(<Particles data-testid="particles" />);
    const el = screen.getByTestId("particles");
    expect(el).toBeInTheDocument();
    expect(el).toHaveAttribute("data-component", "particles");
  });

  it("applies custom className", () => {
    render(<Particles className="opacity-60" data-testid="particles" />);
    const el = screen.getByTestId("particles");
    expect(el.className).toContain("opacity-60");
  });

  it("sets aria-hidden to true", () => {
    render(<Particles data-testid="particles" />);
    const el = screen.getByTestId("particles");
    expect(el).toHaveAttribute("aria-hidden", "true");
  });

  it("renders a canvas element", () => {
    render(<Particles data-testid="particles" />);
    const container = screen.getByTestId("particles");
    const canvas = container.querySelector("canvas");
    expect(canvas).toBeInTheDocument();
  });

  it("passes through data attributes", () => {
    render(<Particles data-testid="particles" data-section="hero" />);
    const el = screen.getByTestId("particles");
    expect(el).toHaveAttribute("data-section", "hero");
  });
});
