import { describe, expect, it } from "vitest";
import { collectExpandablePaths, flattenTree } from "@/lib/json/tree";

describe("collectExpandablePaths", () => {
  it("uses $.key paths consistent with flattenTree", () => {
    const data = { user: { name: "Ada" }, tags: [1, 2] };
    const paths = collectExpandablePaths(data);
    expect(paths).toContain("$");
    expect(paths).toContain("$.user");
    expect(paths).toContain("$.tags");
  });
});

describe("flattenTree expand/collapse", () => {
  const data = { user: { name: "Ada" }, tags: [1, 2] };

  it("shows nested nodes when paths are expanded", () => {
    const expanded = new Set(collectExpandablePaths(data));
    const nodes = flattenTree(data, expanded, "");
    const paths = nodes.map((n) => n.path);
    expect(paths).toContain("$.user");
    expect(paths).toContain("$.user.name");
    expect(paths).toContain("$.tags[0]");
  });

  it("hides children when only root is expanded collapsed", () => {
    const nodes = flattenTree(data, new Set(["$"]), "");
    const paths = nodes.map((n) => n.path);
    expect(paths).toContain("$");
    expect(paths).not.toContain("$.user.name");
  });
});
