import { expect, test } from "@playwright/test";

test("navigation can be promoted, reordered, and persists", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "Desktop navigation owns drag customization");
  await page.goto("/dashboard");
  await page.getByRole("button", { name: "More" }).click();
  await page.getByRole("button", { name: "Customize navigation" }).click();

  await page.getByRole("button", { name: "Pin Sales" }).dragTo(
    page.getByRole("button", { name: "Unpin Dashboard" }),
  );
  await expect(page.getByRole("button", { name: "Unpin Sales" })).toBeVisible();

  await page.getByRole("button", { name: "Unpin Sales" }).focus();
  await page.keyboard.press("ArrowDown");
  await page.getByRole("button", { name: "Done" }).click();
  await page.reload();

  const links = page.locator("aside nav a");
  await expect(links.nth(0)).toHaveText("Dashboard");
  await expect(links.nth(1)).toHaveText("Sales");
  await expect(page.getByRole("button", { name: "More" })).toHaveAttribute("aria-expanded", "false");
});

test("navigation preferences can be reset", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "Desktop navigation owns customization reset");
  await page.goto("/dashboard");
  await page.getByRole("button", { name: "More" }).click();
  await page.getByRole("button", { name: "Customize navigation" }).click();
  await page.getByRole("button", { name: "Pin Sales" }).click();
  await page.getByRole("button", { name: "Reset navigation" }).click();
  await page.getByRole("button", { name: "Done" }).click();

  const links = page.locator("aside nav a");
  await expect(links.nth(0)).toHaveText("Dashboard");
  await expect(links.nth(1)).toHaveText("Checkout");
  await expect(links.nth(2)).toHaveText("Catalog");
});
