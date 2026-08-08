import { beforeEach, describe, expect, it, vi } from "vitest";
import type { PublicTool } from "@/lib/site-config";

vi.mock("@/lib/site-config", () => ({
  getPublicTools: vi.fn(),
}));

import { getPublicTools } from "@/lib/site-config";
import { resolveToolAccess, toolRouteMetadata } from "@/lib/tool-access";

const mockedGetPublicTools = vi.mocked(getPublicTools);

function tool(
  partial: Partial<PublicTool> & Pick<PublicTool, "toolKey" | "status">
): PublicTool {
  return {
    label: partial.label ?? partial.toolKey,
    href: partial.href ?? `/${partial.toolKey}`,
    displayOrder: partial.displayOrder ?? 1,
    ...partial,
  };
}

describe("resolveToolAccess", () => {
  beforeEach(() => {
    mockedGetPublicTools.mockReset();
  });

  it("treats missing tools as live fallback", async () => {
    mockedGetPublicTools.mockResolvedValue([]);
    const access = await resolveToolAccess("xml-formatter");
    expect(access.kind).toBe("live");
  });

  it("returns live for live tools", async () => {
    mockedGetPublicTools.mockResolvedValue([
      tool({ toolKey: "xml-formatter", status: "live", label: "XML Formatter" }),
    ]);
    const access = await resolveToolAccess("xml-formatter");
    expect(access.kind).toBe("live");
    if (access.kind === "live") {
      expect(access.tool.label).toBe("XML Formatter");
    }
  });

  it("returns soon for coming-soon tools", async () => {
    mockedGetPublicTools.mockResolvedValue([
      tool({ toolKey: "csv-to-json", status: "coming-soon" }),
    ]);
    const access = await resolveToolAccess("csv-to-json");
    expect(access.kind).toBe("soon");
  });

  it("returns hidden for hidden tools", async () => {
    mockedGetPublicTools.mockResolvedValue([
      tool({ toolKey: "url-encoder", status: "hidden" }),
    ]);
    const access = await resolveToolAccess("url-encoder");
    expect(access.kind).toBe("hidden");
  });
});

describe("toolRouteMetadata", () => {
  beforeEach(() => {
    mockedGetPublicTools.mockReset();
  });

  it("returns live metadata when tool is live", async () => {
    mockedGetPublicTools.mockResolvedValue([
      tool({ toolKey: "jwt-decoder", status: "live" }),
    ]);
    const meta = await toolRouteMetadata("jwt-decoder", "JWT Decoder", () => ({
      title: "Live JWT",
      description: "ok",
    }));
    expect(meta.title).toBe("Live JWT");
  });

  it("returns noindex metadata when tool is not live", async () => {
    mockedGetPublicTools.mockResolvedValue([
      tool({ toolKey: "jwt-decoder", status: "hidden" }),
    ]);
    const meta = await toolRouteMetadata("jwt-decoder", "JWT Decoder", () => ({
      title: "Live JWT",
    }));
    expect(meta.robots).toMatchObject({ index: false, follow: false });
  });
});
