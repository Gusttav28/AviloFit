import AxeBuilder from "@axe-core/playwright";
import {expect, test, type Locator, type Page} from "@playwright/test";

const widths = [1440, 1024, 768, 360] as const;

async function tabTo(page: Page, target: Locator) {
  for (let index = 0; index < 80; index += 1) {
    if (await target.evaluate(element => document.activeElement === element).catch(() => false)) return;
    await page.keyboard.press("Tab");
  }
  throw new Error(`Keyboard focus did not reach ${await target.getAttribute("aria-label") ?? await target.textContent()}`);
}

function captureUnexpectedRequests(page: Page) {
  const requests: string[] = [];
  page.on("request", request => {
    const url = new URL(request.url());
    if (!["127.0.0.1", "localhost"].includes(url.hostname) || url.pathname.startsWith("/api")) requests.push(request.url());
  });
  return requests;
}

test("dashboard sidebar navigation reaches implemented destinations", async ({page}) => {
  await page.setViewportSize({width: 1440, height: 980});

  await page.goto("/activity");
  await expect(page.getByRole("heading", {name: "Activity", level: 1})).toBeVisible();
  await page.goto("/nutrition");
  await expect(page.getByRole("heading", {name: "FitCore", level: 1})).toBeVisible();

  await page.goto("/dashboard");

  const activityLink = page.getByRole("link", {name: "Activity"});
  await expect(activityLink).toHaveAttribute("href", "/activity");
  await activityLink.click();
  await expect(page).toHaveURL(/\/activity$/);
  await expect(page.getByRole("link", {name: "Activity"})).toHaveAttribute("aria-current", "page");

  await page.goto("/dashboard");
  const nutritionLink = page.getByRole("link", {name: "Nutrition"});
  await expect(nutritionLink).toHaveAttribute("href", "/nutrition");
  await nutritionLink.click();
  await expect(page).toHaveURL(/\/nutrition$/);
  await expect(page.getByRole("link", {name: "Nutrition"})).toHaveAttribute("aria-current", "page");
});

for (const width of widths) {
  test(`dashboard FitCore reference evidence at ${width}px`, async ({page}) => {
    await page.setViewportSize({width, height: 980});
    const requests = captureUnexpectedRequests(page);

    await page.goto("/dashboard");

    const sidebar = page.getByRole("complementary", {name: "Dashboard sidebar"});
    await expect(sidebar.getByRole("link", {name: "Dashboard"})).toHaveAttribute("aria-current", "page");
    await expect(sidebar.getByRole("link", {name: "Activity"})).toHaveAttribute("href", "/activity");
    await expect(sidebar.getByRole("link", {name: "Nutrition"})).toHaveAttribute("href", "/nutrition");
    for (const name of ["Meal Planner", "Course Release", "Progress", "Statistics", "Goals", "Settings"]) {
      await expect(sidebar.getByRole("button", {name})).toBeVisible();
    }

    await expect(page.getByText("Avilo Fit", {exact: true}).first()).toBeVisible();
    await expect(page.getByRole("searchbox", {name: "Search analytics"})).toBeVisible();
    await expect(page.getByRole("button", {name: "Quick Add"})).toBeVisible();
    await expect(page.getByRole("button", {name: "Open calendar"})).toBeVisible();

    await expect(page.getByRole("heading", {name: "Weekly Performance", level: 1})).toBeVisible();
    await expect(page.getByRole("progressbar", {name: "Weekly goal progress"})).toHaveAttribute("aria-valuenow", "75");
    await expect(page.getByText("Activity Score")).toBeVisible();
    await expect(page.getByText("12,450")).toBeVisible();
    await expect(page.locator(".fitcore-metric")).toHaveCount(4);
    for (const value of ["8,432", "70%", "640", "7h 45m"]) await expect(page.getByText(value, {exact: true})).toBeVisible();

    await expect(page.getByRole("heading", {name: "Today's Meals"})).toBeVisible();
    await expect(page.getByText("Avocado & Poached Egg")).toBeVisible();
    await expect(page.getByText("Quinoa Chicken Bowl")).toBeVisible();
    await expect(page.getByText("Grilled Salmon & Asparagus")).toBeVisible();
    await expect(page.locator(".fitcore-meal img")).toHaveCount(2);

    await expect(page.getByRole("heading", {name: "07 / 2026"})).toBeVisible();
    await expect(page.getByText("Upper Body Power (17:00)")).toBeVisible();
    await expect(page.getByRole("heading", {name: "Smart Insights"})).toBeVisible();
    await expect(page.getByText(/Demo wellness guidance, not medical advice/)).toBeVisible();
    await expect(page.getByRole("heading", {name: "Morning Run"})).toBeVisible();
    await expect(page.getByRole("heading", {name: "Strength Training"})).toBeVisible();

    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
    const axe = await new AxeBuilder({page}).analyze();
    expect(axe.violations.filter(violation => ["serious", "critical"].includes(violation.impact ?? ""))).toEqual([]);
    expect(requests).toEqual([]);
    await page.screenshot({path: `test-results/dashboard-fitcore-${width}.png`, fullPage: true});
  });
}

for (const width of widths) {
  test(`dashboard layout stays contained at ${width}px`, async ({page}) => {
    await page.setViewportSize({width, height: 980});
    await page.goto("/dashboard");

    const evidence = await page.evaluate(() => {
      const dashboard = document.querySelector(".fitcore-dashboard") as HTMLElement;
      const topbar = document.querySelector(".fitcore-topbar") as HTMLElement;
      const metrics = [...document.querySelectorAll(".fitcore-metric")] as HTMLElement[];
      const meals = document.querySelector(".fitcore-meals") as HTMLElement;
      const calendar = document.querySelector(".fitcore-calendar") as HTMLElement;
      const insights = document.querySelector(".fitcore-insights") as HTMLElement;
      const bounds = (element: HTMLElement) => {
        const rect = element.getBoundingClientRect();
        return {x: rect.x, y: rect.y, width: rect.width, height: rect.height, right: rect.right, bottom: rect.bottom};
      };
      const viewportWidth = document.documentElement.clientWidth;
      const boxes = [dashboard, topbar, meals, calendar, insights, ...metrics].map(bounds);
      return {
        documentFits: document.documentElement.scrollWidth <= viewportWidth,
        dashboardFits: dashboard.scrollWidth <= dashboard.clientWidth,
        boxesFitViewport: boxes.every(box => box.x >= -1 && box.right <= viewportWidth + 1 && box.width > 0 && box.height > 0),
        metricCount: metrics.length,
        topbarBottom: bounds(topbar).bottom,
        firstMetricTop: bounds(metrics[0]).y
      };
    });

    expect(evidence.documentFits).toBe(true);
    expect(evidence.dashboardFits).toBe(true);
    expect(evidence.boxesFitViewport).toBe(true);
    expect(evidence.metricCount).toBe(4);
    expect(evidence.firstMetricTop).toBeGreaterThan(evidence.topbarBottom);
  });
}

test("dashboard interactions stay local", async ({page}) => {
  await page.setViewportSize({width: 1440, height: 980});
  const requests = captureUnexpectedRequests(page);
  await page.goto("/dashboard");
  requests.length = 0;

  const search = page.getByRole("searchbox", {name: "Search analytics"});
  await search.fill("protein");
  await expect(search).toHaveValue("protein");
  await page.getByRole("button", {name: "Quick Add"}).click();
  await page.getByRole("button", {name: "Open calendar"}).click();

  await page.getByRole("button", {name: "Wednesday, July 22, 2026"}).click();
  await expect(page.getByText("Meal Prep Sunday")).toBeVisible();
  await page.getByRole("button", {name: "Next period"}).click();
  await expect(page.getByRole("button", {name: "Thursday, July 23, 2026"})).toHaveAttribute("aria-current", "date");
  await expect(page).toHaveURL(/\/dashboard$/);
  expect(await page.evaluate(() => ({local: localStorage.length, session: sessionStorage.length}))).toEqual({local: 0, session: 0});
  expect(requests).toEqual([]);
});

test("dashboard keyboard path reaches shared sidebar and main controls", async ({page}) => {
  await page.setViewportSize({width: 1440, height: 980});
  await page.goto("/dashboard");

  await tabTo(page, page.getByRole("link", {name: "Dashboard"}));
  await tabTo(page, page.getByRole("link", {name: "Activity"}));
  await tabTo(page, page.getByRole("link", {name: "Nutrition"}));
  await tabTo(page, page.getByRole("button", {name: "Settings"}));
  await tabTo(page, page.getByRole("searchbox", {name: "Search analytics"}));
  await tabTo(page, page.getByRole("button", {name: "Quick Add"}));
  await tabTo(page, page.getByRole("button", {name: "Open calendar"}));

  const focusEvidence = await page.getByRole("button", {name: "Open calendar"}).evaluate(element => {
    const rect = element.getBoundingClientRect();
    const style = getComputedStyle(element);
    return {outline: style.outlineStyle, width: rect.width, height: rect.height};
  });
  expect(focusEvidence.outline).not.toBe("none");
  expect(focusEvidence.width).toBeGreaterThanOrEqual(40);
  expect(focusEvidence.height).toBeGreaterThanOrEqual(40);
});
