import {describe, expect, it} from "vitest";
import {fixtureMealPlannerProvider} from "@/features/meal-planner/fixture-meal-planner-provider";
import {isAddMealSlot} from "@/features/meal-planner/model";

describe("meal planner fixture", () => {
  it("keeps the fixed FitCore week, targets, bands, add slots, and favorite state", async () => {
    const model = await fixtureMealPlannerProvider.getMealPlanner();
    expect(model.days.map(day => day.label)).toEqual(["Mon 12", "Tue 13", "Wed 14", "Thu 15", "Fri 16", "Sat 17", "Sun 18"]);
    expect(model.initialSelectedDayId).toBe("wed-14");
    expect(model.targets.map(target => `${target.label}:${target.consumed}/${target.target}${target.unit}`)).toEqual([
      "Calories:14200/17500",
      "Protein:920/1050g",
      "Fats:340/420g"
    ]);
    expect(model.overallProgressPercent).toBe(82);
    expect(model.bands.map(band => band.mealType)).toEqual(["Breakfast", "Lunch", "Dinner"]);
    expect(model.bands.every(band => band.slots.length === 7)).toBe(true);
    expect(model.bands[0].slots.map(slot => isAddMealSlot(slot) ? "Add Meal" : slot.name)).toEqual([
      "Avocado Toast & Poached Egg",
      "Blueberry Protein Oats",
      "Add Meal",
      "Super Green Smoothie",
      "Spinach Frittata",
      "Greek Yogurt Parfait",
      "Keto Pancakes"
    ]);
    expect(model.bands[1].slots.map(slot => isAddMealSlot(slot) ? "Add Meal" : slot.name)).toEqual([
      "Grilled Chicken Caesar",
      "Quinoa Power Bowl",
      "Salmon Poke Bowl",
      "Turkey Club Wrap",
      "Lentil Soup & Sourdough",
      "Add Meal",
      "Steak Salad"
    ]);
    expect(model.bands[2].slots.map(slot => isAddMealSlot(slot) ? "Add Meal" : slot.name)).toEqual([
      "Baked Cod with Asparagus",
      "Stir-Fry Beef & Broccoli",
      "Pan-Seared Scallops",
      "Chickpea Curry",
      "Zucchini Noodles Carbonara",
      "Grilled Tofu & Veggies",
      "Turkey Chili"
    ]);
    expect(model.bands.flatMap(band => band.slots).filter(isAddMealSlot)).toHaveLength(2);
    expect(model.bands.flatMap(band => band.slots).filter(slot => !isAddMealSlot(slot) && slot.favorite).map(slot => "name" in slot ? slot.name : "")).toEqual(["Pan-Seared Scallops"]);
  });

  it("returns clone-isolated local data with no remote assets or unsafe health copy", async () => {
    const first = await fixtureMealPlannerProvider.getMealPlanner();
    if (!isAddMealSlot(first.bands[0].slots[0])) first.bands[0].slots[0].name = "Changed";
    const second = await fixtureMealPlannerProvider.getMealPlanner();
    expect(isAddMealSlot(second.bands[0].slots[0])).toBe(false);
    if (!isAddMealSlot(second.bands[0].slots[0])) expect(second.bands[0].slots[0].name).toBe("Avocado Toast & Poached Egg");
    expect(JSON.stringify(second)).not.toMatch(/https?:\/\//i);
    expect(JSON.stringify(second)).not.toMatch(/Date\.now|new Date|Math\.random/i);
    expect(second.safetyDisclosure).toMatch(/No health data is collected/i);
    expect(second.safetyDisclosure).not.toMatch(/diagnosis|treatment|clinical certainty|personalized medical advice/i);
  });
});
