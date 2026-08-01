import { describe, expect, it } from "vitest";
import { ADMIN_BASE_PATH, adminPath } from "@/lib/admin-path";

describe("adminPath", () => {
  it("returns obscured base path", () => {
    expect(ADMIN_BASE_PATH).toBe("/admin-secure-portal-x051908");
    expect(adminPath()).toBe("/admin-secure-portal-x051908");
    expect(adminPath("/ads")).toBe("/admin-secure-portal-x051908/ads");
  });
});
