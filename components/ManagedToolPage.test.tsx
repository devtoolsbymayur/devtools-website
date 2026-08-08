import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const notFound = vi.fn(() => {
  throw new Error("NEXT_NOT_FOUND");
});

vi.mock("next/navigation", () => ({
  notFound: () => notFound(),
}));

vi.mock("@/lib/tool-access", () => ({
  resolveToolAccess: vi.fn(),
}));

import { resolveToolAccess } from "@/lib/tool-access";
import { ManagedToolPage } from "@/components/ManagedToolPage";

const mockedAccess = vi.mocked(resolveToolAccess);

describe("ManagedToolPage", () => {
  beforeEach(() => {
    mockedAccess.mockReset();
    notFound.mockClear();
  });

  it("renders children when tool is live", async () => {
    mockedAccess.mockResolvedValue({
      kind: "live",
      tool: {
        toolKey: "xml-formatter",
        label: "XML Formatter",
        href: "/xml-formatter",
        status: "live",
        displayOrder: 1,
      },
    });

    const ui = await ManagedToolPage({
      toolKey: "xml-formatter",
      soonDescription: "Soon",
      children: <p>Live tool body</p>,
    });
    render(ui);

    expect(screen.getByText("Live tool body")).toBeInTheDocument();
  });

  it("renders coming soon when tool is not live yet", async () => {
    mockedAccess.mockResolvedValue({
      kind: "soon",
      tool: {
        toolKey: "csv-to-json",
        label: "CSV to JSON",
        href: "/csv-to-json",
        status: "coming-soon",
        displayOrder: 1,
      },
    });

    const ui = await ManagedToolPage({
      toolKey: "csv-to-json",
      soonDescription: "CSV conversion is almost ready.",
      children: <p>Should not show</p>,
    });
    render(ui);

    expect(screen.getByText("CSV to JSON")).toBeInTheDocument();
    expect(
      screen.getByText("CSV conversion is almost ready.")
    ).toBeInTheDocument();
    expect(screen.queryByText("Should not show")).not.toBeInTheDocument();
  });

  it("calls notFound when tool is hidden", async () => {
    mockedAccess.mockResolvedValue({ kind: "hidden" });

    await expect(
      ManagedToolPage({
        toolKey: "url-encoder",
        soonDescription: "Soon",
        children: <p>Hidden</p>,
      })
    ).rejects.toThrow("NEXT_NOT_FOUND");
    expect(notFound).toHaveBeenCalled();
  });
});
