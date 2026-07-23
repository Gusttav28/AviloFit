import type {RecipeCardData, RecipeMetric, RecipesSectionStatus} from "./model";

const filterIds = new Set(["all", "breakfast", "lunch", "dinner", "snacks", "high-protein", "low-carb", "vegan"]);

export function boundedWholeNumber(value: number) {
  return Number.isFinite(value) && value >= 0 ? Math.round(value) : 0;
}

export function formatCalories(value: number, locale = "en-US") {
  return `${new Intl.NumberFormat(locale).format(boundedWholeNumber(value))} kcal`;
}

export function formatMinutes(value: number) {
  return `${boundedWholeNumber(value)}m`;
}

export function formatHeroMinutes(value: number) {
  return `${boundedWholeNumber(value)} Mins`;
}

export function formatHeroCalories(value: number, locale = "en-US") {
  return `${new Intl.NumberFormat(locale).format(boundedWholeNumber(value))} Kcal`;
}

export function formatMacro(value: number, unit: "" | "g") {
  return `${boundedWholeNumber(value)}${unit}`;
}

export function formatMetricValue(metric: RecipeMetric) {
  return metric.key === "cal" ? String(boundedWholeNumber(metric.value)) : formatMacro(metric.value, metric.unit);
}

export function isValidFilterId(value: string) {
  return filterIds.has(value);
}

export function recipeMatchesFilter(recipe: RecipeCardData, filterId: string) {
  if (filterId === "all") return true;
  if (!isValidFilterId(filterId)) return false;
  const normalized = filterId.replace(/-/g, " ").toLowerCase();
  return recipe.tags.some(tag => tag.toLowerCase() === normalized);
}

export function isReadySection(status: RecipesSectionStatus) {
  return status === "ready";
}
