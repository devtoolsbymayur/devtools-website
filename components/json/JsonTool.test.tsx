import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/components/json/JsonEditor", () => ({
  JsonEditor: ({
    value,
    onChange,
    readOnly,
  }: {
    value: string;
    onChange: (value: string) => void;
    readOnly?: boolean;
  }) => (
    <textarea
      aria-label={readOnly ? "JSON output" : "JSON input"}
      value={value}
      readOnly={readOnly}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
}));

import { JsonTool } from "@/components/json/JsonTool";

describe("JsonTool", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("formats JSON in formatter mode", async () => {
    const user = userEvent.setup();
    render(<JsonTool mode="formatter" />);

    const input = screen.getByRole("textbox", { name: /json input/i });
    await user.clear(input);
    await user.paste('{"a":1}');
    await user.click(screen.getByRole("button", { name: /^format$/i }));

    await waitFor(() => {
      const output = screen.getByRole("textbox", {
        name: /json output/i,
      }) as HTMLTextAreaElement;
      expect(output.value).toBe('{\n  "a": 1\n}');
    });
  });

  it("shows valid status in validator mode", async () => {
    const user = userEvent.setup();
    render(<JsonTool mode="validator" />);

    const input = screen.getByRole("textbox", { name: /json input/i });
    await user.clear(input);
    await user.paste('{"ok":true}');
    await user.click(screen.getByRole("button", { name: /^validate$/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/no syntax errors found/i)
      ).toBeInTheDocument();
    });
  });

  it("minifies JSON in minifier mode", async () => {
    const user = userEvent.setup();
    render(<JsonTool mode="minifier" />);

    const input = screen.getByRole("textbox", { name: /json input/i });
    await user.clear(input);
    await user.paste('{\n  "a": 1\n}');
    await user.click(screen.getByRole("button", { name: /^minify$/i }));

    await waitFor(() => {
      const output = screen.getByRole("textbox", {
        name: /json output/i,
      }) as HTMLTextAreaElement;
      expect(output.value).toBe('{"a":1}');
    });
  });

  it("shows error for invalid JSON", async () => {
    const user = userEvent.setup();
    render(<JsonTool mode="formatter" />);

    const input = screen.getByRole("textbox", { name: /json input/i });
    await user.clear(input);
    await user.paste("{bad");
    await user.click(screen.getByRole("button", { name: /^format$/i }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });
  });
});
