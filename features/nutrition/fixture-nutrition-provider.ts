import type {NutritionViewModel} from "./model";

const model: NutritionViewModel = {
  locale: "en-US",
  productName: "FitCore",
  searchPlaceholder: "Search foods, recipes...",
  referenceDateLabel: "Today, 24 Oct",
  calories: {
    consumed: 1420,
    target: 2100,
    remaining: 680,
    exerciseAdjustment: 340,
    targetAchievedPercent: 68
  },
  macros: [
    {label: "Protein", consumed: 112, target: 140, unit: "g", guidance: "High-quality lean source recommended", tone: "primary"},
    {label: "Carbs", consumed: 185, target: 220, unit: "g", guidance: "Focus on complex grains", tone: "neutral"},
    {label: "Fats", consumed: 42, target: 65, unit: "g", guidance: "Healthy mono-fats priority", tone: "dark"}
  ],
  secondaryNutrients: [
    {label: "Fiber", value: 24, unit: "g", tone: "primary"},
    {label: "Sugar", value: 32, unit: "g", tone: "muted"}
  ],
  hydration: {
    consumed: 2100,
    target: 3000,
    increment: 250,
    totalGlasses: 10,
    filledGlasses: 6
  },
  meals: [
    {
      id: "breakfast-oats",
      name: "Steel-cut Oats with Berries",
      mealType: "Breakfast",
      time: "08:30 AM",
      calories: 420,
      macros: [{label: "P", value: 12}, {label: "C", value: 64}, {label: "F", value: 8}],
      imageAlt: "Bowl of steel-cut oats with berries",
      visual: "oats"
    },
    {
      id: "lunch-salmon",
      name: "Grilled Salmon & Avocado Salad",
      mealType: "Lunch",
      time: "01:15 PM",
      calories: 580,
      macros: [{label: "P", value: 42}, {label: "C", value: 18}, {label: "F", value: 32}],
      imageAlt: "Grilled salmon and avocado salad",
      visual: "salmon"
    }
  ],
  analysis: {
    title: "AI Nutritional Analysis",
    body: "Your lunch was rich in Omega-3 but slightly low on dietary fiber. For dinner, consider a side of roasted chickpeas or broccoli to reach your fiber goal of 35g.",
    disclosure: "Informational demo guidance only. This is not medical advice, diagnosis, treatment, or a professional nutrition relationship."
  },
  recommendations: [
    {
      id: "next-meal",
      title: "Next Meal Suggestion",
      body: "Based on your activity level today, a high-protein dinner is suggested. Aim for 35g+ protein as general demo guidance.",
      actionLabel: "Lemon Garlic Cod",
      icon: "meal"
    },
    {
      id: "micronutrients",
      title: "Micro-nutrients Tip",
      body: "You haven't tracked many Magnesium sources this week. Try adding pumpkin seeds or spinach to your dinner.",
      icon: "micronutrient"
    }
  ],
  recipes: [
    {id: "quinoa-power-bowl", name: "Quinoa Power Bowl", duration: "15 MIN", descriptors: ["High Protein", "Gluten Free"], imageAlt: "Quinoa power bowl with vegetables", visual: "bowl"},
    {id: "lean-turkey-wrap", name: "Lean Turkey Wrap", duration: "10 MIN", descriptors: ["Low Carb", "Energy Boost"], imageAlt: "Lean turkey wrap on a plate", visual: "wrap"}
  ],
  safetyDisclosure: "Deterministic local demo nutrition data. No health data is collected, persisted, transmitted, or inferred.",
  sectionStates: {
    calories: "ready",
    macros: "ready",
    hydration: "ready",
    meals: "ready",
    recommendations: "ready",
    recipes: "ready"
  }
};

export const fixtureNutritionProvider = {
  getNutrition: async () => structuredClone(model)
};
