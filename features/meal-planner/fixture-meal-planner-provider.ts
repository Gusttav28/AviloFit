import type {MealBandData, MealPlannerDay, MealPlannerViewModel, WeeklyTarget} from "./model";

const days: MealPlannerDay[] = [
  {id: "mon-12", label: "Mon 12", accessibleLabel: "Monday 12"},
  {id: "tue-13", label: "Tue 13", accessibleLabel: "Tuesday 13"},
  {id: "wed-14", label: "Wed 14", accessibleLabel: "Wednesday 14"},
  {id: "thu-15", label: "Thu 15", accessibleLabel: "Thursday 15"},
  {id: "fri-16", label: "Fri 16", accessibleLabel: "Friday 16"},
  {id: "sat-17", label: "Sat 17", accessibleLabel: "Saturday 17"},
  {id: "sun-18", label: "Sun 18", accessibleLabel: "Sunday 18"}
];

const targets: WeeklyTarget[] = [
  {id: "calories", label: "Calories", consumed: 14200, target: 17500, unit: ""},
  {id: "protein", label: "Protein", consumed: 920, target: 1050, unit: "g"},
  {id: "fats", label: "Fats", consumed: 340, target: 420, unit: "g"}
];

const bands: MealBandData[] = [
  {
    mealType: "Breakfast",
    icon: "sun",
    slots: [
      {id: "breakfast-mon", dayId: "mon-12", mealType: "Breakfast", name: "Avocado Toast & Poached Egg", calories: 420, visual: "avocado", imageAlt: "Avocado toast with a poached egg"},
      {id: "breakfast-tue", dayId: "tue-13", mealType: "Breakfast", name: "Blueberry Protein Oats", calories: 380, visual: "oats", imageAlt: "Blueberry protein oats in a bowl"},
      {id: "breakfast-wed-add", dayId: "wed-14", mealType: "Breakfast", kind: "add"},
      {id: "breakfast-thu", dayId: "thu-15", mealType: "Breakfast", name: "Super Green Smoothie", calories: 310, visual: "smoothie", imageAlt: "Green smoothie bowl with seeds"},
      {id: "breakfast-fri", dayId: "fri-16", mealType: "Breakfast", name: "Spinach Frittata", calories: 350},
      {id: "breakfast-sat", dayId: "sat-17", mealType: "Breakfast", name: "Greek Yogurt Parfait", calories: 290},
      {id: "breakfast-sun", dayId: "sun-18", mealType: "Breakfast", name: "Keto Pancakes", calories: 440}
    ]
  },
  {
    mealType: "Lunch",
    icon: "lunch",
    slots: [
      {id: "lunch-mon", dayId: "mon-12", mealType: "Lunch", name: "Grilled Chicken Caesar", calories: 520},
      {id: "lunch-tue", dayId: "tue-13", mealType: "Lunch", name: "Quinoa Power Bowl", calories: 480, visual: "quinoa", imageAlt: "Quinoa power bowl with vegetables"},
      {id: "lunch-wed", dayId: "wed-14", mealType: "Lunch", name: "Salmon Poke Bowl", calories: 610},
      {id: "lunch-thu", dayId: "thu-15", mealType: "Lunch", name: "Turkey Club Wrap", calories: 450},
      {id: "lunch-fri", dayId: "fri-16", mealType: "Lunch", name: "Lentil Soup & Sourdough", calories: 390},
      {id: "lunch-sat-add", dayId: "sat-17", mealType: "Lunch", kind: "add"},
      {id: "lunch-sun", dayId: "sun-18", mealType: "Lunch", name: "Steak Salad", calories: 580}
    ]
  },
  {
    mealType: "Dinner",
    icon: "dinner",
    slots: [
      {id: "dinner-mon", dayId: "mon-12", mealType: "Dinner", name: "Baked Cod with Asparagus", calories: 380},
      {id: "dinner-tue", dayId: "tue-13", mealType: "Dinner", name: "Stir-Fry Beef & Broccoli", calories: 550},
      {id: "dinner-wed", dayId: "wed-14", mealType: "Dinner", name: "Pan-Seared Scallops", calories: 420, visual: "scallops", imageAlt: "Pan-seared scallops on a plate", favorite: true},
      {id: "dinner-thu", dayId: "thu-15", mealType: "Dinner", name: "Chickpea Curry", calories: 510},
      {id: "dinner-fri", dayId: "fri-16", mealType: "Dinner", name: "Zucchini Noodles Carbonara", calories: 320},
      {id: "dinner-sat", dayId: "sat-17", mealType: "Dinner", name: "Grilled Tofu & Veggies", calories: 440},
      {id: "dinner-sun", dayId: "sun-18", mealType: "Dinner", name: "Turkey Chili", calories: 560}
    ]
  }
];

const model: MealPlannerViewModel = {
  locale: "en-US",
  productName: "Meal Planner",
  searchPlaceholder: "Search recipes...",
  initialSelectedDayId: "wed-14",
  days,
  targets,
  overallProgressPercent: 82,
  overallProgressLabel: "ON TRACK",
  groceryCta: {
    title: "Generate Grocery List",
    body: "Based on your weekly meals"
  },
  bands,
  safetyDisclosure: "Deterministic local demo meal-planning data. No health data is collected, persisted, transmitted, inferred, or used for medical advice.",
  sectionStates: {
    targets: "ready",
    grocery: "ready",
    planner: "ready"
  }
};

export const fixtureMealPlannerProvider = {
  getMealPlanner: async () => structuredClone(model)
};
