import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.clear());
  await page.goto("/");
  await expect(page).toHaveURL(/\/checkout$/);
});

async function openMobileCart(page: import("@playwright/test").Page) {
  const cartTab = page.getByRole("button", { name: /Current sale/ });
  if (await cartTab.isVisible()) await cartTab.click();
}

test("cashier opens a shift, completes a sale, and receives a receipt", async ({ page }) => {
  await expect(page.getByText("Sale is not available")).toBeVisible();
  await page.getByRole("button", { name: "Open shift" }).click();
  await expect(page.getByRole("dialog", { name: "Open cash shift" })).toBeVisible();
  await page.getByRole("button", { name: "Open shift" }).last().click();
  await expect(page.getByText("Cash register ready")).toBeVisible();

  await page.getByRole("button", { name: /Espresso,/ }).click();
  await openMobileCart(page);
  const payButton = page.getByRole("button", { name: /Pay 28,000 UZS/ });
  await expect(payButton).toBeEnabled();
  await payButton.click();

  await expect(page.getByRole("dialog", { name: "Payment successful" })).toBeVisible();
  await expect(page.getByText("The sale is complete and inventory has been updated.")).toBeVisible();
  await expect(page.getByText("28,000 UZS")).toBeVisible();
});

test("draft persists and clears the active cart", async ({ page }) => {
  await page.getByRole("button", { name: /Cappuccino,/ }).click();
  await openMobileCart(page);
  await page.getByRole("button", { name: "Save draft" }).click();
  await expect(page.getByText("Sale saved as a draft.")).toBeVisible();
  const emptyCartTab = page.getByRole("button", { name: /Current sale \(0\)/ });
  if (await emptyCartTab.isVisible()) {
    await expect(emptyCartTab).toBeVisible();
  } else {
    await expect(page.getByText("No items in this sale")).toBeVisible();
  }
  const saved = await page.evaluate(() => localStorage.getItem("dinopos-v6-checkout"));
  expect(saved).toContain("drafts");
  expect(saved).toContain("Cappuccino");
});

test("desktop checkout has no serious accessibility violations", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "Run the full axe scan once on desktop");
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});

test("profile controls open and switch theme without runtime errors", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "Desktop rail owns the persistent profile control");
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.getByRole("button", { name: "Profile" }).click();
  const themeButton = page.getByRole("button", { name: "Toggle theme" });
  await expect(themeButton).toBeVisible();
  await themeButton.click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  expect(errors).toEqual([]);
});

test("layout remains usable without horizontal overflow", async ({ page }) => {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(1);
  if (await page.getByRole("button", { name: /Current sale/ }).isVisible()) {
    await page.getByRole("button", { name: /Espresso,/ }).click();
    await openMobileCart(page);
    await expect(page.getByRole("complementary").getByText("Espresso")).toBeVisible();
  }
});
