import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { NotFoundView } from "@/components/NotFoundView";

describe("NotFoundView", () => {
  it("renders 404 messaging and primary CTA", () => {
    render(<NotFoundView />);
    expect(
      screen.getByRole("heading", { name: /couldn't be parsed/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /back to json formatter/i })
    ).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: /contact us/i })).toHaveAttribute(
      "href",
      "/contact"
    );
    expect(screen.getByText(/page_not_found/)).toBeInTheDocument();
  });
});
