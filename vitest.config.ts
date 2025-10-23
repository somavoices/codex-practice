import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const rootDir = dirname(fileURLToPath(new URL(".", import.meta.url)));

export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(rootDir, ".")
    }
  },
  test: {
    include: ["tests/**/*.test.ts"],
    environment: "node",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
    threads: false,
    env: {
      DATABASE_URL: "file:./test.db",
      NEXTAUTH_SECRET: "test-secret",
      NEXTAUTH_URL: "http://localhost:3000"
    },
    coverage: {
      reporter: ["text", "json", "html"],
      provider: "v8",
      reportsDirectory: "./coverage"
    }
  }
});
