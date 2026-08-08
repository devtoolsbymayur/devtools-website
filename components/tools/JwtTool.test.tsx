import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { JwtTool } from "@/components/tools/JwtTool";

describe("JwtTool", () => {
  it("decodes the sample JWT header and payload", async () => {
    const user = userEvent.setup();
    render(<JwtTool />);

    await user.click(screen.getByRole("button", { name: /^decode$/i }));

    await waitFor(() => {
      const header = screen.getByRole("textbox", {
        name: /^header$/i,
      }) as HTMLTextAreaElement;
      const payload = screen.getByRole("textbox", {
        name: /^payload$/i,
      }) as HTMLTextAreaElement;
      expect(header.value).toContain("HS256");
      expect(payload.value).toContain("John Doe");
    });
  });

  it("shows an error for invalid JWT input", async () => {
    const user = userEvent.setup();
    render(<JwtTool />);

    const token = screen.getByRole("textbox", { name: /^jwt$/i });
    await user.clear(token);
    await user.paste("not-a-jwt");
    await user.click(screen.getByRole("button", { name: /^decode$/i }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });
  });
});
