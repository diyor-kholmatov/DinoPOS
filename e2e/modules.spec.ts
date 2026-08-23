import { expect, test } from "@playwright/test";

const routes = [
  ["dashboard", "Dashboard"],
  ["catalog", "Products & Services"],
  ["catalog/import", "Import"],
  ["inventory", "Inventory / Stocktake"],
  ["inventory/transfers", "Transfer"],
  ["customers", "Customers"],
  ["reports", "Reports"],
  ["sales", "Sales"],
  ["suppliers", "Purchase Orders / Suppliers"],
  ["returns", "Returns"],
  ["drafts", "Drafts"],
  ["holds", "Holds"],
  ["shift", "Cash Shift"],
  ["cash-operations", "Cash Operations"],
  ["register-history", "Register History"],
  ["settings", "Settings"],
] as const;

test("all migrated modules render without overflow or raw translation keys", async ({ page }) => {
  for (const [route, heading] of routes) {
    await page.goto(`/${route}`);
    await expect(page.getByRole("heading", { level: 1, name: heading })).toBeVisible();
    const state = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth - window.innerWidth,
      text: document.body.innerText,
    }));
    expect(state.overflow, route).toBeLessThanOrEqual(1);
    expect(state.text, route).not.toMatch(/\b(?:settings|common|table|dashboard|operation|history)\.[A-Za-z]/);
  }
});

test("dashboard filters update the selected period and open the date range calendar", async ({ page }) => {
  await page.goto("/dashboard");
  await page.getByRole("button", { name: "Week" }).click();
  await expect(page.getByRole("button", { name: "Week" })).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Date range" }).click();
  await expect(page.getByRole("dialog", { name: "Date range" })).toBeVisible();
});

test("language switching applies to every route and persists", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "The desktop profile popover owns this check");
  await page.goto("/dashboard");
  await page.getByRole("button", { name: "Profile" }).click();
  await page.getByRole("button", { name: "Language" }).click();
  await page.getByRole("option", { name: "Русский" }).click();
  await expect(page.getByRole("heading", { level: 1, name: "Главная" })).toBeVisible();
  await page.reload();
  await expect(page.getByRole("heading", { level: 1, name: "Главная" })).toBeVisible();
});
