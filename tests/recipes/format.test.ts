import {describe, expect, it} from "vitest";
import {formatCalories, formatHeroCalories, formatHeroMinutes, formatMacro, formatMetricValue, formatMinutes, isReadySection, isValidFilterId, recipeMatchesFilter} from "@/features/recipes/format";
import type {RecipeCardData} from "@/features/recipes/model";

const recipe: RecipeCardData = {
  id: "salmon",
  title: "Seared Salmon & Wild Rice",
  minutes: 25,
  tags: ["High Protein", "Easy Prep"],
  metrics: [{key: "protein", label: "P", value: 42, unit: "g"}],
  visual: "salmon",
  imageAlt: "Salmon",
  defaultFavorite: false
};

describe("Recipes format helpers", () => {
  it("formats exact calories, macro, and time labels", () => {
    expect(formatCalories(580)).toBe("580 kcal");
    expect(formatHeroCalories(420)).toBe("420 Kcal");
    expect(formatMinutes(25)).toBe("25m");
    expect(formatHeroMinutes(15)).toBe("15 Mins");
    expect(formatMacro(42, "g")).toBe("42g");
    expect(formatMetricValue({key: "cal", label: "Cal", value: 580, unit: ""})).toBe("580");
  });

  it("bounds invalid numeric values instead of rendering NaN", () => {
    expect(formatCalories(Number.NaN)).toBe("0 kcal");
    expect(formatHeroCalories(Number.POSITIVE_INFINITY)).toBe("0 Kcal");
    expect(formatMinutes(-2)).toBe("0m");
    expect(formatMetricValue({key: "fat", label: "F", value: Number.NaN, unit: "g"})).toBe("0g");
  });

  it("matches known local filter ids and rejects invalid ones", () => {
    expect(isValidFilterId("all")).toBe(true);
    expect(isValidFilterId("high-protein")).toBe(true);
    expect(isValidFilterId("made-up")).toBe(false);
    expect(recipeMatchesFilter(recipe, "all")).toBe(true);
    expect(recipeMatchesFilter(recipe, "high-protein")).toBe(true);
    expect(recipeMatchesFilter(recipe, "vegan")).toBe(false);
    expect(recipeMatchesFilter(recipe, "bad")).toBe(false);
  });

  it("identifies ready section state", () => {
    expect(isReadySection("ready")).toBe(true);
    expect(isReadySection("loading")).toBe(false);
  });
});
