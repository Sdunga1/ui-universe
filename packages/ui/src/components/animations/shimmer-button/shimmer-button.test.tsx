import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ShimmerButton } from "./shimmer-button";

describe("ShimmerButton", () => {
  it("renders children", () => {
    render(<ShimmerButton>Click me</ShimmerButton>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("renders as a button element", () => {
    render(<ShimmerButton>Label</ShimmerButton>);
    const button = screen.getByRole("button", { name: "Label" });
    expect(button).toBeInTheDocument();
    expect(button.tagName).toBe("BUTTON");
  });

  it("applies custom className", () => {
    render(<ShimmerButton className="bg-white text-black">CTA</ShimmerButton>);
    const button = screen.getByRole("button");
    expect(button.className).toContain("bg-white");
    expect(button.className).toContain("text-black");
  });

  it("sets data-shimmer-button attribute", () => {
    render(<ShimmerButton>CTA</ShimmerButton>);
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("data-shimmer-button");
  });

  it("passes through button props", () => {
    render(
      <ShimmerButton type="submit" disabled>
        Submit
      </ShimmerButton>,
    );
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("type", "submit");
    expect(button).toBeDisabled();
  });

  it("applies id prop", () => {
    render(<ShimmerButton id="cta-btn">Go</ShimmerButton>);
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("id", "cta-btn");
  });
});
