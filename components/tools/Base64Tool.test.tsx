import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Base64Tool } from "@/components/tools/Base64Tool";

describe("Base64Tool", () => {
  it("encodes sample text", async () => {
    const user = userEvent.setup();
    render(<Base64Tool />);

    await user.click(screen.getByRole("button", { name: /^encode$/i }));

    await waitFor(() => {
      const output = screen.getByRole("textbox", {
        name: /^output$/i,
      }) as HTMLTextAreaElement;
      expect(output.value).toBe("SGVsbG8sIGpzb24u");
    });
  });

  it("decodes base64 text", async () => {
    const user = userEvent.setup();
    render(<Base64Tool />);

    const input = screen.getByRole("textbox", { name: /^input$/i });
    await user.clear(input);
    await user.paste("SGVsbG8=");
    await user.click(screen.getByRole("button", { name: /^decode$/i }));

    await waitFor(() => {
      const output = screen.getByRole("textbox", {
        name: /^output$/i,
      }) as HTMLTextAreaElement;
      expect(output.value).toBe("Hello");
    });
  });

  it("shows error for invalid base64", async () => {
    const user = userEvent.setup();
    render(<Base64Tool />);

    const input = screen.getByRole("textbox", { name: /^input$/i });
    await user.clear(input);
    await user.paste("!!!");
    await user.click(screen.getByRole("button", { name: /^decode$/i }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(/invalid base64/i);
    });
  });
});
