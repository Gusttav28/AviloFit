import {NutritionScreen} from "@/components/nutrition/nutrition-screen";
import {fixtureNutritionProvider} from "@/features/nutrition/fixture-nutrition-provider";

export default async function NutritionPage() {
  const model = await fixtureNutritionProvider.getNutrition();
  return <NutritionScreen model={model} />;
}
