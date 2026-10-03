import { chromium } from "@playwright/test";
import { resolve } from "node:path";

const baseUrl = process.env.DINOPOS_CAPTURE_URL ?? "http://127.0.0.1:4273";
const browser = await chromium.launch({ headless: true });

try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  await page.addInitScript(() => localStorage.clear());
  await page.goto(`${baseUrl}/checkout`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Open shift" }).click();
  await page.getByRole("dialog", { name: "Open cash shift" }).getByRole("button", { name: "Open shift" }).click();
  await page.getByText("Cash register ready").waitFor();
  await page.getByRole("button", { name: /Espresso,/ }).click();
  await page.getByRole("button", { name: /Cappuccino,/ }).click();
  await page.waitForTimeout(3500);

  if (await page.getByText("Sale is not available").isVisible()) {
    throw new Error("The product capture still contains the closed-shift warning.");
  }

  await page.screenshot({ path: resolve("apps/web/public/product/checkout.png") });
} finally {
  await browser.close();
}
