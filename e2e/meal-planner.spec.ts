import AxeBuilder from "@axe-core/playwright";
import {expect, test} from "@playwright/test";

const viewports = [
  {width: 1440, height: 900},
  {width: 1024, height: 900},
  {width: 768, height: 900},
  {width: 390, height: 844}
] as const;

for (const viewport of viewports) {
  test(`Meal Planner reference evidence at ${viewport.width}px`, async ({page}) => {
    await page.setViewportSize(viewport);
    const requests: string[] = [];
    page.on("request", request => {
      const url = new URL(request.url());
      if (!["127.0.0.1", "localhost"].includes(url.hostname) || url.pathname.startsWith("/api")) requests.push(request.url());
    });

    await page.goto("/meal-planner");

    await expect(page.getByRole("heading", {name: "Meal Planner", level: 1})).toBeVisible();
    await expect(page.getByRole("link", {name: "Meal Planner"})).toHaveAttribute("aria-current", "page");
    await expect(page.getByRole("button", {name: "Generate Grocery List"})).toBeVisible();
    await expect(page.getByText("14,200")).toBeVisible();
    await expect(page.getByText("920g")).toBeVisible();
    await expect(page.getByText("340g")).toBeVisible();
    await expect(page.getByRole("button", {name: "Wednesday 14", exact: true})).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByText("Avocado Toast & Poached Egg")).toBeVisible();
    await expect(page.getByText("Quinoa Power Bowl")).toBeVisible();
    await expect(page.getByRole("button", {name: /Pan-Seared Scallops, Dinner, Wednesday 14, 420 kcal, favorite/i})).toBeVisible();
    await expect(page.getByRole("button", {name: "Smart planning suggestions"})).toBeVisible();
    await expect(page.getByRole("button", {name: "Add meal from floating action"})).toBeVisible();

    await page.getByRole("searchbox", {name: "Search recipes"}).fill("oats");
    await expect(page.getByRole("searchbox", {name: "Search recipes"})).toHaveValue("oats");
    await page.getByRole("button", {name: "Friday 16", exact: true}).click();
    await expect(page.getByRole("button", {name: "Friday 16", exact: true})).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByText("Selected Friday 16.")).toBeAttached();
    await page.getByRole("button", {name: "Generate Grocery List"}).click();
    await expect(page.getByText("Grocery list generation is not connected in this demo.")).toBeAttached();
    await expect(page).toHaveURL(/\/meal-planner$/);

    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
    expect(await page.evaluate(() => ({local: localStorage.length, session: sessionStorage.length}))).toEqual({local: 0, session: 0});
    expect(requests).toEqual([]);
    const axe = await new AxeBuilder({page}).analyze();
    expect(axe.violations.filter(violation => ["serious", "critical"].includes(violation.impact ?? ""))).toEqual([]);
    await page.screenshot({path: `test-results/meal-planner-${viewport.width}.png`, fullPage: true});
  });
}

test("Meal Planner keyboard and sidebar path stays reachable", async ({page}) => {
  await page.setViewportSize({width: 1440, height: 900});
  await page.goto("/meal-planner");
  await page.keyboard.press("Tab");
  await expect(page.locator(":focus")).toBeVisible();
  await page.getByRole("searchbox", {name: "Search recipes"}).fill("smoothie");
  await expect(page.getByRole("searchbox", {name: "Search recipes"})).toHaveValue("smoothie");
  await page.getByRole("link", {name: "Dashboard"}).click();
  await expect(page).toHaveURL(/\/dashboard$/);
  await page.goto("/meal-planner");
  await page.getByRole("link", {name: "Nutrition"}).click();
  await expect(page).toHaveURL(/\/nutrition$/);
});
