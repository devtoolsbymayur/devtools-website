import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { TimestampTool } from "@/components/tools/TimestampTool";

describe("TimestampTool", () => {
  it("converts unix timestamp to date formats", async () => {
    const user = userEvent.setup();
    render(<TimestampTool />);

    await user.click(
      screen.getByRole("button", { name: /timestamp → date/i })
    );

    await waitFor(() => {
      const output = screen.getByRole("textbox", {
        name: /all formats \/ batch tsv/i,
      });
      const value = (output as HTMLTextAreaElement).value;
      expect(value).toContain("Unix (seconds):");
      expect(value).toContain("ISO 8601:");
    });
  });

  it("uses current time", async () => {
    const user = userEvent.setup();
    render(<TimestampTool />);

    await user.click(screen.getByRole("button", { name: /use current time/i }));

    await waitFor(() => {
      const unix = screen.getByRole("textbox", {
        name: /unix timestamp/i,
      }) as HTMLTextAreaElement;
      expect(unix.value).toMatch(/^\d+$/);
    });
  });

  it("batch-converts multiple unix lines", async () => {
    const user = userEvent.setup();
    render(<TimestampTool />);

    const unix = screen.getByRole("textbox", {
      name: /unix timestamp/i,
    });
    await user.clear(unix);
    await user.paste("1754074800\n1754074801");
    await user.click(
      screen.getByRole("button", { name: /timestamp → date/i })
    );

    await waitFor(() => {
      const output = screen.getByRole("textbox", {
        name: /all formats \/ batch tsv/i,
      }) as HTMLTextAreaElement;
      expect(output.value).toContain("unix_seconds");
      expect(output.value).toContain("1754074800");
      expect(output.value).toContain("1754074801");
    });
  });
});
