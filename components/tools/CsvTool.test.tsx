import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { CsvTool } from "@/components/tools/CsvTool";

describe("CsvTool", () => {
  it("converts CSV to JSON", async () => {
    const user = userEvent.setup();
    render(<CsvTool />);

    await user.click(screen.getByRole("button", { name: /csv → json/i }));

    await waitFor(() => {
      const output = screen.getByRole("textbox", { name: /output/i });
      const value = (output as HTMLTextAreaElement).value;
      expect(value).toContain('"name"');
      expect(value).toContain("John");
    });
  });

  it("converts JSON to CSV", async () => {
    const user = userEvent.setup();
    render(<CsvTool />);

    const input = screen.getByRole("textbox", { name: /csv \/ json input/i });
    await user.clear(input);
    await user.paste('[{"name":"Ada","age":36}]');
    await user.click(screen.getByRole("button", { name: /json → csv/i }));

    await waitFor(() => {
      const output = screen.getByRole("textbox", { name: /output/i });
      expect((output as HTMLTextAreaElement).value).toContain("name,age");
      expect((output as HTMLTextAreaElement).value).toContain("Ada,36");
    });
  });

  it("shows error for invalid JSON → CSV", async () => {
    const user = userEvent.setup();
    render(<CsvTool />);

    const input = screen.getByRole("textbox", { name: /csv \/ json input/i });
    await user.clear(input);
    await user.paste('{"not":"array"}');
    await user.click(screen.getByRole("button", { name: /json → csv/i }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });
  });
});
