import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  retries: 1,
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:4273",
    trace: "retain-on-failure",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    {
      name: "tablet",
      use: {
        browserName: "chromium",
        viewport: { width: 1024, height: 1366 },
        hasTouch: true,
      },
    },
    {
      name: "mobile",
      use: {
        browserName: "chromium",
        viewport: { width: 393, height: 851 },
        hasTouch: true,
        isMobile: true,
      },
    },
  ],
  webServer: {
    command: "pnpm dev --host 127.0.0.1 --port 4273",
    url: "http://127.0.0.1:4273",
    reuseExistingServer: false,
  },
});
