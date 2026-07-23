export type NutritionSectionName = "calories" | "macros" | "hydration" | "meals" | "recommendations" | "recipes";
export type NutritionSectionStatus = "ready" | "loading" | "empty" | "error";

export type MacroTone = "primary" | "neutral" | "dark";

export interface DailyCalories {
  consumed: number;
  target: number;
  remaining: number;
  exerciseAdjustment: number;
  targetAchievedPercent: number;
}

export interface MacroItem {
  label: "Protein" | "Carbs" | "Fats";
  consumed: number;
  target: number;
  unit: "g";
  guidance: string;
  tone: MacroTone;
}

export interface SecondaryNutrient {
  label: "Fiber" | "Sugar";
  value: number;
  unit: "g";
  tone: "primary" | "muted";
}

export interface Hydration {
  consumed: number;
  target: number;
  increment: number;
  totalGlasses: number;
  filledGlasses: number;
}

export interface MealMacro {
  label: "P" | "C" | "F";
  value: number;
}

export interface MealHistoryItem {
  id: string;
  name: string;
  mealType: string;
  time: string;
  calories: number;
  macros: MealMacro[];
  imageAlt: string;
  visual: "oats" | "salmon";
}

export interface NutritionAnalysis {
  title: string;
  body: string;
  disclosure: string;
}

export interface NutritionRecommendation {
  id: string;
  title: string;
  body: string;
  actionLabel?: string;
  icon: "meal" | "micronutrient";
}

export interface NutritionRecipe {
  id: string;
  name: string;
  duration: string;
  descriptors: string[];
  imageAlt: string;
  visual: "bowl" | "wrap";
}

export interface NutritionViewModel {
  locale: string;
  productName: string;
  searchPlaceholder: string;
  referenceDateLabel: string;
  calories: DailyCalories;
  macros: MacroItem[];
  secondaryNutrients: SecondaryNutrient[];
  hydration: Hydration;
  meals: MealHistoryItem[];
  analysis: NutritionAnalysis;
  recommendations: NutritionRecommendation[];
  recipes: NutritionRecipe[];
  safetyDisclosure: string;
  sectionStates: Record<NutritionSectionName, NutritionSectionStatus>;
}
