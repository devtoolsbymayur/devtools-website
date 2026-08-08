import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { XmlTool } from "@/components/tools/XmlTool";

describe("XmlTool", () => {
  it("formats XML on Format click", async () => {
    const user = userEvent.setup();
    render(<XmlTool />);

    const input = screen.getByRole("textbox", { name: /^input$/i });
    await user.clear(input);
    await user.paste("<a><b>x</b></a>");
    await user.click(screen.getByRole("button", { name: /^format$/i }));

    await waitFor(() => {
      expect(screen.getByText(/valid xml/i)).toBeInTheDocument();
    });
    const output = screen.getByRole("textbox", { name: /output/i });
    expect((output as HTMLTextAreaElement).value).toContain("<b>x</b>");
  });

  it("shows error for invalid XML on Validate", async () => {
    const user = userEvent.setup();
    render(<XmlTool />);

    const input = screen.getByRole("textbox", { name: /^input$/i });
    await user.clear(input);
    await user.paste("<a><b></a>");
    await user.click(screen.getByRole("button", { name: /^validate$/i }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });
  });

  it("converts XML to JSON", async () => {
    const user = userEvent.setup();
    render(<XmlTool />);

    await user.click(screen.getByRole("button", { name: /xml → json/i }));

    await waitFor(() => {
      const output = screen.getByRole("textbox", { name: /output/i });
      expect((output as HTMLTextAreaElement).value).toContain('"user"');
    });
  });
});
