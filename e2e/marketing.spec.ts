import { expect, test } from "@playwright/test";

test("landing tells the one-shift story without horizontal overflow", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Магазин работает в своём ритме." })).toBeVisible();
  await expect(page.getByRole("button", { name: /Посмотреть одну смену/ })).toBeVisible();
  await expect(page.locator(".story-transcript").getByText("Интернет пропал. Продажа — нет.", { exact: true })).toBeAttached();

  const viewport = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  expect(viewport.scrollWidth).toBe(viewport.clientWidth);
});

test("landing stays separate while the current dashboard remains available", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator('a[href*="dashboard"]')).toHaveCount(0);

  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByRole("heading", { name: "All stores" })).toBeVisible();
});
