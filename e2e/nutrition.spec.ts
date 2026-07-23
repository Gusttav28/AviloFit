import AxeBuilder from "@axe-core/playwright";
import {expect, test} from "@playwright/test";

const widths = [1440, 1024, 768, 360] as const;

for (const width of widths) {
  test(`Nutrition reference evidence at ${width}px`, async ({page}) => {
    await page.setViewportSize({width, height: 980});
    const requests: string[] = [];
    page.on("request", request => {
      const url = new URL(request.url());
      if (!["127.0.0.1", "localhost"].includes(url.hostname) || url.pathname.startsWith("/api")) requests.push(request.url());
    });
    await page.goto("/nutrition");
    await expect(page.getByRole("heading", {name: "FitCore", level: 1})).toBeVisible();
    await expect(page.getByRole("link", {name: "Nutrition"})).toHaveAttribute("aria-current", "page");
    await expect(page.getByText("1,420")).toBeVisible();
    await expect(page.getByText("Protein", {exact: true})).toBeVisible();
    await expect(page.getByText("Steel-cut Oats with Berries")).toBeVisible();
    await expect(page.getByText(/not medical advice/i)).toBeVisible();
    await expect(page.getByRole("button", {name: "View Quinoa Power Bowl recipe"})).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
    const axe = await new AxeBuilder({page}).analyze();
    expect(axe.violations.filter(v => ["serious", "critical"].includes(v.impact ?? ""))).toEqual([]);
    expect(requests).toEqual([]);
    await page.screenshot({path: `test-results/nutrition-${width}.png`, fullPage: true});
  });
}

test("Nutrition interactions remain local and capped", async ({page}) => {
  await page.setViewportSize({width: 1440, height: 980});
  const requests: string[] = [];
  page.on("request", request => {
    const url = new URL(request.url());
    if (!["127.0.0.1", "localhost"].includes(url.hostname) || url.pathname.startsWith("/api")) requests.push(request.url());
  });
  await page.goto("/nutrition");
  await page.getByRole("searchbox", {name: "Search foods and recipes"}).fill("oats");
  await page.getByRole("button", {name: "Add 250ml"}).click();
  await expect(page.locator(".nutrition-hydration-total strong")).toHaveText("2,350");
  for (let index = 0; index < 5; index += 1) await page.getByRole("button", {name: "Add 250ml"}).click();
  await expect(page.locator(".nutrition-hydration-total strong")).toHaveText("3,000");
  await expect(page).toHaveURL(/\/nutrition$/);
  expect(await page.evaluate(() => ({local: localStorage.length, session: sessionStorage.length}))).toEqual({local: 0, session: 0});
  expect(requests).toEqual([]);
  await page.screenshot({path: "test-results/nutrition-focused.png"});
});
