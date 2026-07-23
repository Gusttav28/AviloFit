import {fireEvent, render, screen, within} from "@testing-library/react";
import {describe, expect, it, vi} from "vitest";
import {RecipesScreen} from "@/components/recipes/recipes-screen";
import {fixtureRecipesProvider} from "@/features/recipes/fixture-recipes-provider";
import type {RecipesSectionName, RecipesSectionStatus} from "@/features/recipes/model";

const sectionLabels: Record<RecipesSectionName, string> = {
  hero: "Featured Recipe",
  discovery: "Recipe Discovery",
  filters: "Recipe Filters",
  recipes: "Recipe Cards"
};

describe("Recipes screen", () => {
  it("renders route hierarchy, topbar, and active preserved sidebar state", async () => {
    render(<RecipesScreen model={await fixtureRecipesProvider.getRecipes()} />);
    expect(screen.getByRole("heading", {name: "Recipes", level: 1})).toBeInTheDocument();
    expect(screen.getByRole("searchbox", {name: "Search elite recipes"})).toHaveAttribute("placeholder", "Search elite recipes...");
    expect(screen.getByRole("button", {name: "Calendar"})).toBeInTheDocument();
    expect(screen.getByRole("button", {name: "Notifications"})).toBeInTheDocument();
    const nav = screen.getByRole("navigation", {name: "Dashboard sections"});
    expect(within(nav).getByRole("link", {name: "Recipes"})).toHaveAttribute("href", "/recipes");
    expect(within(nav).getByRole("link", {name: "Recipes"})).toHaveAttribute("aria-current", "page");
    expect(Array.from(document.querySelectorAll(".avilo-sidebar-nav .avilo-sidebar-item")).map(item => item.textContent)).toEqual([
      "Dashboard",
      "Activity",
      "Nutrition",
      "Meal Planner",
      "Recipes",
      "Progress",
      "Statistics",
      "Goals"
    ]);
    expect(document.querySelectorAll(".avilo-sidebar-item svg")).toHaveLength(9);
  });

  it("renders exact hero, discovery, filters, and recipe card data", async () => {
    render(<RecipesScreen model={await fixtureRecipesProvider.getRecipes()} />);
    expect(screen.getByRole("heading", {name: "Mediterranean Quinoa Salad"})).toBeInTheDocument();
    expect(screen.getByText("Featured Selection")).toBeInTheDocument();
    expect(screen.getByText("Engineered for recovery. High fiber, high protein, and packed with micro-nutrients to fuel your post-training window.")).toBeInTheDocument();
    expect(screen.getByText("15 Mins")).toBeInTheDocument();
    expect(screen.getByText("420 Kcal")).toBeInTheDocument();
    expect(screen.getByText("24g Protein")).toBeInTheDocument();
    expect(screen.getByRole("button", {name: "Start Cooking"})).toBeInTheDocument();
    expect(screen.getByRole("heading", {name: /Trending This Week/})).toBeInTheDocument();
    expect(screen.getByText("Post-Run Power Smoothie")).toBeInTheDocument();
    expect(screen.getByText("Classic Lean Muscle Plate")).toBeInTheDocument();
    expect(screen.getByText("Elite Overnight Oats")).toBeInTheDocument();
    expect(screen.getByRole("heading", {name: "Seasonal: Spring Fuel"})).toBeInTheDocument();
    expect(screen.getByText("Optimized for outdoor training season. Fresh, crisp, and high-energy ingredients.")).toBeInTheDocument();
    expect(screen.getAllByRole("article").map(article => within(article).getByRole("heading").textContent)).toEqual([
      "Seared Salmon & Wild Rice",
      "Elite Vegan Power Bowl",
      "Lean Ginger Beef Stir-fry",
      "Avocado & Egg Sourdough"
    ]);
    for (const value of ["580", "42g", "38g", "22g", "410", "18g", "52g", "14g", "490", "28g", "380", "16g", "32g", "24g"]) {
      expect(screen.getAllByText(value).length).toBeGreaterThan(0);
    }
  });

  it("keeps interactions local and deterministic", async () => {
    const setItem = vi.spyOn(Storage.prototype, "setItem");
    const pushState = vi.spyOn(history, "pushState");
    render(<RecipesScreen model={await fixtureRecipesProvider.getRecipes()} />);
    const search = screen.getByRole("searchbox", {name: "Search elite recipes"});
    fireEvent.change(search, {target: {value: "salmon"}});
    expect(search).toHaveValue("salmon");
    expect(screen.getByRole("button", {name: "All"})).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(screen.getByRole("button", {name: "High Protein"}));
    expect(screen.getByRole("button", {name: "High Protein"})).toHaveAttribute("aria-pressed", "true");
    expect(screen.getAllByRole("article").map(article => within(article).getByRole("heading").textContent)).toEqual([
      "Seared Salmon & Wild Rice",
      "Lean Ginger Beef Stir-fry"
    ]);
    const favorite = screen.getByRole("button", {name: "Add Seared Salmon & Wild Rice to local favorites"});
    fireEvent.click(favorite);
    expect(screen.getByRole("button", {name: "Remove Seared Salmon & Wild Rice from local favorites"})).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(screen.getAllByRole("button", {name: "Quick Add to Meal Planner"})[0]);
    expect(screen.getByText("Quick Add is a local demo control. Meal Planner was not changed.")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", {name: "Recipe cooking action"}));
    expect(screen.getByText("Recipe tools are presentation-only in this demo.")).toBeInTheDocument();
    expect(setItem).not.toHaveBeenCalled();
    expect(pushState).not.toHaveBeenCalled();
    setItem.mockRestore();
    pushState.mockRestore();
  });

  it("represents independent section states and retry without resetting ready siblings", async () => {
    const names: RecipesSectionName[] = ["hero", "discovery", "filters", "recipes"];
    for (const status of ["loading", "empty", "error"] as RecipesSectionStatus[]) {
      for (const name of names) {
        const model = await fixtureRecipesProvider.getRecipes();
        model.sectionStates[name] = status;
        const view = render(<RecipesScreen model={model} />);
        if (status === "loading") {
          expect(screen.getByText(`${sectionLabels[name]} is loading.`)).toBeInTheDocument();
        } else {
          expect(screen.getByText(status === "error" ? /could not load/i : /has no available demo data/i)).toBeInTheDocument();
          fireEvent.click(screen.getByRole("button", {name: "Retry section"}));
          expect(screen.getByText(`${sectionLabels[name]} restored.`)).toBeInTheDocument();
        }
        view.unmount();
      }
    }
  });
});
