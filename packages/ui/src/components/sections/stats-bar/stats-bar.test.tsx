import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { StatsBar } from "./stats-bar";

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

const mockStats = [
  { value: 10000, label: "Users", suffix: "+" },
  { value: 99.9, label: "Uptime", suffix: "%" },
  { value: 50, label: "Countries" },
];

describe("StatsBar", () => {
  it("renders all stat labels", () => {
    render(<StatsBar stats={mockStats} triggerOnView={false} />);
    expect(screen.getByText("Users")).toBeInTheDocument();
    expect(screen.getByText("Uptime")).toBeInTheDocument();
    expect(screen.getByText("Countries")).toBeInTheDocument();
  });

  it("applies data-component attribute", () => {
    const { container } = render(<StatsBar stats={mockStats} triggerOnView={false} />);
    const section = container.querySelector("[data-component='stats-bar']");
    expect(section).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <StatsBar stats={mockStats} className="bg-neutral-950" triggerOnView={false} />,
    );
    const section = container.querySelector("[data-component='stats-bar']");
    expect(section?.className).toContain("bg-neutral-950");
  });

  it("renders correct number of stat items", () => {
    render(<StatsBar stats={mockStats} triggerOnView={false} />);
    const labels = screen.getAllByText(/Users|Uptime|Countries/);
    expect(labels).toHaveLength(3);
  });

  it("passes through data attributes", () => {
    const { container } = render(
      <StatsBar stats={mockStats} data-section="metrics" triggerOnView={false} />,
    );
    const section = container.querySelector("[data-component='stats-bar']");
    expect(section).toHaveAttribute("data-section", "metrics");
  });

  it("renders prefix and suffix via Counter", () => {
    render(
      <StatsBar
        stats={[{ value: 100, label: "Revenue", prefix: "$", suffix: "M" }]}
        triggerOnView={false}
      />,
    );
    expect(screen.getByText("Revenue")).toBeInTheDocument();
  });
});
