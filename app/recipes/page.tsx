import {RecipesScreen} from "@/components/recipes/recipes-screen";
import {fixtureRecipesProvider} from "@/features/recipes/fixture-recipes-provider";

export default async function RecipesPage() {
  const model = await fixtureRecipesProvider.getRecipes();
  return <RecipesScreen model={model} />;
}
