import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts",
    coverage: {
      provider: "istanbul",
      reporter: ["text", "html", "lcov"], // formats
      reportsDirectory: "./coverage",
      exclude: ["node_modules/", "src/setupTests.ts"],
    },
  },
});
