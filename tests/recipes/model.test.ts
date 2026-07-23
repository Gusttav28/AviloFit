import {describe, expect, it} from "vitest";
import {fixtureRecipesProvider} from "@/features/recipes/fixture-recipes-provider";

describe("Recipes fixture model", () => {
  it("returns the exact reference content in deterministic order", async () => {
    const model = await fixtureRecipesProvider.getRecipes();
    expect(model.productName).toBe("Recipes");
    expect(model.searchPlaceholder).toBe("Search elite recipes...");
    expect(model.featured).toMatchObject({
      title: "Mediterranean Quinoa Salad",
      badge: "Featured Selection",
      description: "Engineered for recovery. High fiber, high protein, and packed with micro-nutrients to fuel your post-training window.",
      minutes: 15,
      calories: 420,
      protein: "24g Protein",
      ctaLabel: "Start Cooking"
    });
    expect(model.trending.map(recipe => [recipe.title, recipe.calories, recipe.minutes])).toEqual([
      ["Post-Run Power Smoothie", 280, 5],
      ["Classic Lean Muscle Plate", 540, 20],
      ["Elite Overnight Oats", 320, 5]
    ]);
    expect(model.filters.map(filter => filter.label)).toEqual(["All", "Breakfast", "Lunch", "Dinner", "Snacks", "High Protein", "Low Carb", "Vegan"]);
    expect(model.recipes.map(recipe => recipe.title)).toEqual([
      "Seared Salmon & Wild Rice",
      "Elite Vegan Power Bowl",
      "Lean Ginger Beef Stir-fry",
      "Avocado & Egg Sourdough"
    ]);
  });

  it("encodes exact recipe card metrics", async () => {
    const model = await fixtureRecipesProvider.getRecipes();
    expect(model.recipes.map(recipe => ({
      title: recipe.title,
      minutes: recipe.minutes,
      tags: recipe.tags,
      metrics: recipe.metrics.map(metric => [metric.label, metric.value, metric.unit])
    }))).toEqual([
      {title: "Seared Salmon & Wild Rice", minutes: 25, tags: ["High Protein", "Easy Prep"], metrics: [["Cal", 580, ""], ["P", 42, "g"], ["C", 38, "g"], ["F", 22, "g"]]},
      {title: "Elite Vegan Power Bowl", minutes: 15, tags: ["Vegan", "Low Carb"], metrics: [["Cal", 410, ""], ["P", 18, "g"], ["C", 52, "g"], ["F", 14, "g"]]},
      {title: "Lean Ginger Beef Stir-fry", minutes: 20, tags: ["Dinner", "High Protein"], metrics: [["Cal", 490, ""], ["P", 38, "g"], ["C", 28, "g"], ["F", 18, "g"]]},
      {title: "Avocado & Egg Sourdough", minutes: 10, tags: ["Breakfast", "Healthy Fats"], metrics: [["Cal", 380, ""], ["P", 16, "g"], ["C", 32, "g"], ["F", 24, "g"]]}
    ]);
  });

  it("returns isolated clones and local visual keys without remote URLs", async () => {
    const first = await fixtureRecipesProvider.getRecipes();
    first.recipes[0].title = "Changed";
    first.recipes[0].metrics[0].value = 0;
    const second = await fixtureRecipesProvider.getRecipes();
    expect(second.recipes[0].title).toBe("Seared Salmon & Wild Rice");
    expect(second.recipes[0].metrics[0].value).toBe(580);
    const serialized = JSON.stringify(second);
    expect(serialized).not.toMatch(/https?:\/\//i);
    expect(serialized).not.toMatch(/Date\.now|Math\.random|fetch|localStorage|sessionStorage/i);
  });
});
