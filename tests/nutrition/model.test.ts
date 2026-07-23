import {describe, expect, it} from "vitest";
import {formatCalories, formatNumber, formatSigned} from "@/features/nutrition/format";
import {fixtureNutritionProvider} from "@/features/nutrition/fixture-nutrition-provider";

describe("nutrition fixture", () => {
  it("keeps required FitCore reference values deterministic", async () => {
    const model = await fixtureNutritionProvider.getNutrition();
    expect(model.calories).toMatchObject({consumed: 1420, target: 2100, remaining: 680, exerciseAdjustment: 340});
    expect(model.macros.map(macro => `${macro.label}:${macro.consumed}/${macro.target}${macro.unit}`)).toEqual([
      "Protein:112/140g",
      "Carbs:185/220g",
      "Fats:42/65g"
    ]);
    expect(model.hydration).toMatchObject({consumed: 2100, target: 3000, increment: 250, totalGlasses: 10, filledGlasses: 6});
    expect(model.meals.map(meal => meal.name)).toEqual(["Steel-cut Oats with Berries", "Grilled Salmon & Avocado Salad"]);
    expect(model.recipes.map(recipe => recipe.name)).toEqual(["Quinoa Power Bowl", "Lean Turkey Wrap"]);
  });

  it("returns clone-isolated local data with no remote assets", async () => {
    const first = await fixtureNutritionProvider.getNutrition();
    first.meals[0].name = "changed";
    const second = await fixtureNutritionProvider.getNutrition();
    expect(second.meals[0].name).toBe("Steel-cut Oats with Berries");
    expect(JSON.stringify(second)).not.toMatch(/https?:\/\//i);
    expect(second.safetyDisclosure).toMatch(/no health data is collected/i);
    expect(second.analysis.disclosure).toMatch(/not medical advice/i);
  });

  it("formats displayed nutrition values consistently", () => {
    expect(formatNumber(1420)).toBe("1,420");
    expect(formatCalories(2100)).toBe("2,100 kcal");
    expect(formatSigned(340)).toBe("+340");
  });
});
