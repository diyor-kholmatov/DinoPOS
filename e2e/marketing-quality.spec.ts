import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

async function waitForLanding(page: Page) {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Магазин работает в своём ритме." })).toBeVisible();
  await page.locator(".landing-hero img").evaluate(async (image: HTMLImageElement) => {
    await document.fonts.ready;
    if (!image.complete) await image.decode();
  });
}

test("landing has no broken media, runtime errors, or horizontal overflow", async ({ page }) => {
  const runtimeErrors: string[] = [];
  page.on("pageerror", (error) => runtimeErrors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") runtimeErrors.push(message.text());
  });

  await waitForLanding(page);

  const checkpoints = [0, 0.25, 0.5, 0.75, 1];
  for (const checkpoint of checkpoints) {
    await page.evaluate((progress) => window.scrollTo(0, (document.documentElement.scrollHeight - innerHeight) * progress), checkpoint);
    await page.waitForTimeout(100);
    const dimensions = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }));
    expect(dimensions.scrollWidth).toBe(dimensions.clientWidth);
  }

  await page.locator("#roles").scrollIntoViewIfNeeded();
  await page.waitForTimeout(150);
  const brokenImages = await page.locator("img").evaluateAll((images) =>
    images.filter((image) => !(image as HTMLImageElement).complete || (image as HTMLImageElement).naturalWidth === 0)
      .map((image) => (image as HTMLImageElement).src),
  );

  expect(brokenImages).toEqual([]);
  expect(runtimeErrors).toEqual([]);
});

test("scroll story, roles, and locales remain operable", async ({ page }) => {
  await waitForLanding(page);

  await page.getByRole("button", { name: /Посмотреть одну смену/ }).click();
  await expect(page.locator("#shift")).toBeInViewport();

  const closing = page.getByRole("button", { name: /22:04:/ });
  await closing.click();
  await expect(closing).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".shift-copy-body h3")).toHaveText("День закрывается одной понятной картиной");

  await page.locator("#roles").scrollIntoViewIfNeeded();
  await page.getByRole("tab", { name: "Владелец" }).click();
  await expect(page.getByRole("tabpanel")).toContainText("Понять бизнес без сборки отчёта");

  await page.getByRole("button", { name: "UZ" }).click();
  await expect(page.getByRole("heading", { name: "Do‘kon o‘z ritmida ishlaydi." })).toBeAttached();
  await expect(page.locator("html")).toHaveAttribute("lang", "uz");
  await expect(page.locator('a[href*="dashboard"]')).toHaveCount(0);
});

test("product frames stay readable, complete, and separated from copy", async ({ page }) => {
  await page.setViewportSize({ width: 2048, height: 1152 });
  await waitForLanding(page);

  const heroImage = page.locator(".landing-hero .product-frame-image");
  await expect(heroImage).toHaveAttribute("src", /product\/dashboard\.png$/);
  await expect(heroImage).toHaveCSS("object-fit", "contain");

  const offline = page.getByRole("button", { name: /14:18:/ });
  await offline.click();
  await expect(offline).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".shift-product .product-frame-image")).toHaveCSS("filter", "none");

  const inventory = page.getByRole("button", { name: /18:35:/ });
  await inventory.click();
  await expect(inventory).toHaveAttribute("aria-pressed", "true");

  const separation = await page.evaluate(() => {
    const heading = document.querySelector<HTMLElement>(".shift-copy-body h3");
    const frame = document.querySelector<HTMLElement>(".shift-product .product-frame");
    if (!heading || !frame) throw new Error("Story layout is missing");
    const range = document.createRange();
    range.selectNodeContents(heading);
    return {
      textRight: range.getBoundingClientRect().right,
      frameLeft: frame.getBoundingClientRect().left,
    };
  });
  expect(separation.textRight).toBeLessThan(separation.frameLeft);
});

test("landing passes automated accessibility checks and reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await waitForLanding(page);

  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();

  expect(results.violations.filter((violation) => violation.impact === "critical" || violation.impact === "serious")).toEqual([]);
});
