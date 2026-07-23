export type RecipesSectionName = "hero" | "discovery" | "filters" | "recipes";
export type RecipesSectionStatus = "ready" | "loading" | "empty" | "error";
export type RecipeMetricKey = "cal" | "protein" | "carbs" | "fat";
export type RecipeVisual = "salmon" | "vegan-bowl" | "stir-fry" | "avocado" | "smoothie" | "oats" | "quinoa";

export interface RecipeMetric {
  key: RecipeMetricKey;
  label: "Cal" | "P" | "C" | "F";
  value: number;
  unit: "" | "g";
}

export interface RecipeCategory {
  id: string;
  label: string;
}

export interface RecipeCardData {
  id: string;
  title: string;
  minutes: number;
  tags: string[];
  metrics: RecipeMetric[];
  visual: RecipeVisual;
  imageAlt: string;
  defaultFavorite: boolean;
}

export interface TrendingRecipeData {
  id: string;
  title: string;
  calories: number;
  minutes: number;
  visual: RecipeVisual;
  imageAlt: string;
}

export interface FeaturedRecipeData {
  title: string;
  badge: string;
  description: string;
  minutes: number;
  calories: number;
  protein: string;
  ctaLabel: string;
  visual: RecipeVisual;
  imageAlt: string;
}

export interface SeasonalPromoData {
  title: string;
  body: string;
  ctaLabel: string;
}

export interface RecipesTopbarActions {
  calendarLabel: string;
  notificationsLabel: string;
}

export interface RecipesViewModel {
  locale: string;
  productName: "Recipes";
  searchPlaceholder: string;
  topbarActions: RecipesTopbarActions;
  featured: FeaturedRecipeData;
  trending: TrendingRecipeData[];
  seasonal: SeasonalPromoData;
  filters: RecipeCategory[];
  selectedFilterId: string;
  recipes: RecipeCardData[];
  floatingActionLabel: string;
  safetyDisclosure: string;
  sectionStates: Record<RecipesSectionName, RecipesSectionStatus>;
}
