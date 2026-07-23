export type MealPlannerSectionName = "targets" | "grocery" | "planner";
export type MealPlannerSectionStatus = "ready" | "loading" | "empty" | "error";
export type MealType = "Breakfast" | "Lunch" | "Dinner";
export type MealVisual = "avocado" | "oats" | "smoothie" | "quinoa" | "scallops" | "neutral";

export interface MealPlannerDay {
  id: string;
  label: string;
  accessibleLabel: string;
}

export interface WeeklyTarget {
  id: string;
  label: "Calories" | "Protein" | "Fats";
  consumed: number;
  target: number;
  unit: "" | "g";
}

export interface MealCardData {
  id: string;
  dayId: string;
  mealType: MealType;
  name: string;
  calories: number;
  visual?: MealVisual;
  imageAlt?: string;
  favorite?: boolean;
}

export interface AddMealSlotData {
  id: string;
  dayId: string;
  mealType: MealType;
  kind: "add";
}

export type MealSlot = MealCardData | AddMealSlotData;

export interface MealBandData {
  mealType: MealType;
  icon: "sun" | "lunch" | "dinner";
  slots: MealSlot[];
}

export interface GroceryCta {
  title: string;
  body: string;
}

export interface MealPlannerViewModel {
  locale: string;
  productName: string;
  searchPlaceholder: string;
  initialSelectedDayId: string;
  days: MealPlannerDay[];
  targets: WeeklyTarget[];
  overallProgressPercent: number;
  overallProgressLabel: string;
  groceryCta: GroceryCta;
  bands: MealBandData[];
  safetyDisclosure: string;
  sectionStates: Record<MealPlannerSectionName, MealPlannerSectionStatus>;
}

export function isAddMealSlot(slot: MealSlot): slot is AddMealSlotData {
  return "kind" in slot && slot.kind === "add";
}
