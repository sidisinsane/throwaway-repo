import { expect, test } from "@playwright/test";

test("has correct page title", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle("Home");
});

test("has correct page language", async ({ page }) => {
  await page.goto("/");

  const rootElement = page.locator("html");
  const lang = await rootElement.getAttribute("lang");

  await expect(lang).toBe("en-US");
});
