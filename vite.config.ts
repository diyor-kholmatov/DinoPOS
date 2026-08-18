import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig(({ mode }) => ({
  base: mode === "production" ? "/DinoPOS/" : "/",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": new URL("./src", import.meta.url).pathname,
    },
  },
  build: {
    rolldownOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return undefined;
          if (id.includes("react-aria") || id.includes("@internationalized")) return "aria";
          if (id.includes("react-router")) return "router";
          if (id.includes("@radix-ui")) return "radix";
          if (id.includes("react-hook-form") || id.includes("zod")) return "forms";
          if (id.includes("i18next") || id.includes("zustand")) return "state-i18n";
          if (id.includes("lucide-react")) return "icons";
          if (id.includes("react") || id.includes("scheduler")) return "react-core";
          return "vendor";
        },
      },
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/tests/setup.ts",
    include: ["src/**/*.test.{ts,tsx}"],
    css: true,
  },
}));
