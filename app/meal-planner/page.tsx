import {MealPlannerScreen} from "@/components/meal-planner/meal-planner-screen";
import {fixtureMealPlannerProvider} from "@/features/meal-planner/fixture-meal-planner-provider";

export default async function MealPlannerPage() {
  const model = await fixtureMealPlannerProvider.getMealPlanner();
  return <MealPlannerScreen model={model} />;
}
