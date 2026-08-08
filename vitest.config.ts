import path from "node:path";
import { defineConfig } from "vitest/config";

const alias = {
  "@": path.resolve(__dirname, "."),
};

export default defineConfig({
  resolve: { alias },
  test: {
    setupFiles: ["./vitest.setup.ts"],
    exclude: ["node_modules", ".next"],
    projects: [
      {
        resolve: { alias },
        test: {
          name: "unit",
          environment: "node",
          include: ["**/*.{test,spec}.ts"],
          exclude: [
            "node_modules",
            ".next",
            "**/xml.test.ts",
            "**/base64.test.ts",
            "**/loadToolFile.test.ts",
          ],
          setupFiles: ["./vitest.setup.ts"],
        },
      },
      {
        resolve: { alias },
        test: {
          name: "dom",
          environment: "jsdom",
          include: [
            "**/*.{test,spec}.tsx",
            "**/xml.test.ts",
            "**/base64.test.ts",
            "**/loadToolFile.test.ts",
          ],
          exclude: ["node_modules", ".next"],
          setupFiles: ["./vitest.setup.ts"],
        },
      },
    ],
  },
});
