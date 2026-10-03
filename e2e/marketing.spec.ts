import { expect, test } from "@playwright/test";

test("landing introduces DinoPOS without horizontal overflow", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: /Продажи продолжаются/ })).toBeVisible();
  await expect(page.getByRole("link", { name: "Открыть продукт" }).first()).toBeVisible();

  const viewport = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  expect(viewport.scrollWidth).toBe(viewport.clientWidth);
});

test("landing demo link opens the current React dashboard", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Открыть продукт" }).first().click();

  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByRole("heading", { name: "All stores" })).toBeVisible();
});
