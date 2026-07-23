import AxeBuilder from "@axe-core/playwright";
import {expect, test, type Locator, type Page} from "@playwright/test";

const viewports = [
  {width: 1440, height: 900},
  {width: 1024, height: 900},
  {width: 768, height: 900},
  {width: 390, height: 844}
] as const;

async function tabTo(page: Page, target: Locator) {
  for (let index = 0; index < 90; index += 1) {
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

for (const viewport of viewports) {
  test(`Recipes reference evidence at ${viewport.width}px`, async ({page}) => {
    await page.setViewportSize(viewport);
    const requests = captureUnexpectedRequests(page);
    const browserErrors: string[] = [];
    page.on("console", message => {
      if (["error", "warning"].includes(message.type())) browserErrors.push(message.text());
    });
    page.on("pageerror", error => browserErrors.push(error.message));

    await page.goto("/recipes");

    const sidebar = page.getByRole("complementary", {name: "Dashboard sidebar"});
    await expect(page.getByRole("heading", {name: "Recipes", level: 1})).toBeVisible();
    await expect(sidebar.getByRole("link", {name: "Recipes"})).toHaveAttribute("href", "/recipes");
    await expect(sidebar.getByRole("link", {name: "Recipes"})).toHaveAttribute("aria-current", "page");
    await expect(sidebar.getByRole("link", {name: "Meal Planner"})).toHaveAttribute("href", "/meal-planner");
    await expect(sidebar.getByRole("button", {name: "Progress"})).toBeVisible();

    await expect(page.getByRole("searchbox", {name: "Search elite recipes"})).toHaveAttribute("placeholder", "Search elite recipes...");
    await expect(page.getByRole("button", {name: "Calendar"})).toBeVisible();
    await expect(page.getByRole("button", {name: "Notifications"})).toBeVisible();
    await expect(page.getByRole("heading", {name: "Mediterranean Quinoa Salad"})).toBeVisible();
    await expect(page.getByText("Featured Selection")).toBeVisible();
    await expect(page.getByText("15 Mins")).toBeVisible();
    await expect(page.getByText("420 Kcal")).toBeVisible();
    await expect(page.getByText("24g Protein")).toBeVisible();
    await expect(page.getByRole("heading", {name: /Trending This Week/})).toBeVisible();
    await expect(page.getByText("Post-Run Power Smoothie")).toBeVisible();
    await expect(page.getByRole("heading", {name: "Seasonal: Spring Fuel"})).toBeVisible();
    await expect(page.getByRole("button", {name: "All"})).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByRole("heading", {name: "Seared Salmon & Wild Rice"})).toBeVisible();
    await expect(page.getByRole("heading", {name: "Elite Vegan Power Bowl"})).toBeVisible();
    await expect(page.getByRole("heading", {name: "Lean Ginger Beef Stir-fry"})).toBeVisible();
    await expect(page.getByRole("heading", {name: "Avocado & Egg Sourdough"})).toBeVisible();

    await page.getByRole("searchbox", {name: "Search elite recipes"}).fill("salmon");
    await expect(page.getByRole("searchbox", {name: "Search elite recipes"})).toHaveValue("salmon");
    await page.getByRole("button", {name: "High Protein"}).click();
    expect(browserErrors).toEqual([]);
    await expect(page.getByRole("button", {name: "High Protein"})).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByRole("heading", {name: "Seared Salmon & Wild Rice"})).toBeVisible();
    await expect(page.getByRole("heading", {name: "Lean Ginger Beef Stir-fry"})).toBeVisible();
    await page.getByRole("button", {name: "Add Seared Salmon & Wild Rice to local favorites"}).click();
    await expect(page.getByRole("button", {name: "Remove Seared Salmon & Wild Rice from local favorites"})).toHaveAttribute("aria-pressed", "true");
    await page.getByRole("button", {name: "Quick Add to Meal Planner"}).first().click();
    await expect(page.getByText("Quick Add is a local demo control. Meal Planner was not changed.")).toBeAttached();
    await page.getByRole("button", {name: "Recipe cooking action"}).click();
    await expect(page.getByText("Recipe tools are presentation-only in this demo.")).toBeAttached();
    await expect(page).toHaveURL(/\/recipes$/);

    const geometry = await page.evaluate(() => {
      const navItems = [...document.querySelectorAll(".avilo-sidebar-nav .avilo-sidebar-item")] as HTMLElement[];
      const recipesPage = document.querySelector(".recipes-page") as HTMLElement;
      const cards = [...document.querySelectorAll(".recipes-card")] as HTMLElement[];
      const floating = document.querySelector(".recipes-floating-action") as HTMLElement;
      const viewportWidth = document.documentElement.clientWidth;
      const bounds = (element: HTMLElement) => {
        const rect = element.getBoundingClientRect();
        return {x: rect.x, right: rect.right, width: rect.width, height: rect.height};
      };
      const floatingBounds = bounds(floating);
      return {
        documentFits: document.documentElement.scrollWidth <= viewportWidth,
        recipesFits: recipesPage.scrollWidth <= recipesPage.clientWidth,
        sidebarOrder: navItems.map(item => item.textContent?.trim()),
        cardCount: cards.length,
        cardsHaveStableSize: cards.every(card => {
          const rect = card.getBoundingClientRect();
          return rect.width > 0 && rect.height > 220;
        }),
        floatingInViewport: floatingBounds.right <= viewportWidth + 1 && floatingBounds.width >= 44 && floatingBounds.height >= 44,
        touchTargets: [...document.querySelectorAll(".recipes-quick-add,.recipes-favorite-button,.recipes-floating-action,.recipes-filter-chip")] .every(element => {
          const rect = (element as HTMLElement).getBoundingClientRect();
          return rect.width >= 38 && rect.height >= 38;
        })
      };
    });
    expect(geometry.documentFits).toBe(true);
    expect(geometry.recipesFits).toBe(true);
    expect(geometry.sidebarOrder).toEqual(["Dashboard", "Activity", "Nutrition", "Meal Planner", "Recipes", "Progress", "Statistics", "Goals"]);
    expect(geometry.cardCount).toBe(viewport.width >= 1024 ? 2 : 2);
    expect(geometry.cardsHaveStableSize).toBe(true);
    expect(geometry.floatingInViewport).toBe(true);
    expect(geometry.touchTargets).toBe(true);
    expect(await page.evaluate(() => ({local: localStorage.length, session: sessionStorage.length, hash: location.hash, search: location.search}))).toEqual({local: 0, session: 0, hash: "", search: ""});
    expect(requests).toEqual([]);
    const axe = await new AxeBuilder({page}).analyze();
    expect(axe.violations.filter(violation => ["serious", "critical"].includes(violation.impact ?? ""))).toEqual([]);
    await page.screenshot({path: `test-results/recipes-${viewport.width}.png`, fullPage: true});
  });
}

test("Recipes keyboard path and Meal Planner route preservation", async ({page}) => {
  await page.setViewportSize({width: 1440, height: 900});
  await page.goto("/recipes");
  await tabTo(page, page.getByRole("link", {name: "Dashboard"}));
  await tabTo(page, page.getByRole("link", {name: "Meal Planner"}));
  await tabTo(page, page.getByRole("link", {name: "Recipes"}));
  await tabTo(page, page.getByRole("searchbox", {name: "Search elite recipes"}));
  await tabTo(page, page.getByRole("button", {name: "Calendar"}));
  await page.getByRole("link", {name: "Meal Planner"}).click();
  await expect(page).toHaveURL(/\/meal-planner$/);
  await expect(page.getByRole("heading", {name: "Meal Planner", level: 1})).toBeVisible();
  await expect(page.getByRole("link", {name: "Meal Planner"})).toHaveAttribute("aria-current", "page");
});
