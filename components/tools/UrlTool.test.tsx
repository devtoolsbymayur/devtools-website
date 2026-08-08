import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { UrlTool } from "@/components/tools/UrlTool";

describe("UrlTool", () => {
  it("encodes URL text", async () => {
    const user = userEvent.setup();
    render(<UrlTool />);

    await user.click(screen.getByRole("button", { name: /^encode$/i }));

    await waitFor(() => {
      const output = screen.getByRole("textbox", {
        name: /encoded \/ decoded/i,
      });
      expect((output as HTMLTextAreaElement).value).toContain("%20");
    });
  });

  it("shows query breakdown for sample URL", () => {
    render(<UrlTool />);
    expect(screen.getByText("Query breakdown")).toBeInTheDocument();
    expect(screen.getByText("q")).toBeInTheDocument();
    expect(screen.getByText("hello world")).toBeInTheDocument();
  });

  it("decodes percent-encoded input", async () => {
    const user = userEvent.setup();
    render(<UrlTool />);

    const input = screen.getByRole("textbox", { name: /plain text \/ url/i });
    await user.clear(input);
    await user.paste("hello%20world");
    await user.click(screen.getByRole("button", { name: /^decode$/i }));

    await waitFor(() => {
      const output = screen.getByRole("textbox", {
        name: /encoded \/ decoded/i,
      });
      expect((output as HTMLTextAreaElement).value).toBe("hello world");
    });
  });
});
