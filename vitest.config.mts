import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: "unit",
          include: ["tests/unit/**/*.test.ts"],
          environment: "node",
        },
        resolve: {
          alias: {
            "@": path.resolve(rootDir, "./src"),
          },
        },
      },
      {
        test: {
          name: "rls",
          include: ["tests/rls/**/*.test.ts"],
          environment: "node",
          testTimeout: 60_000,
          hookTimeout: 60_000,
        },
        resolve: {
          alias: {
            "@": path.resolve(rootDir, "./src"),
          },
        },
      },
    ],
  },
});
