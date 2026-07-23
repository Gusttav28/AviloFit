import type {RecipeCardData, RecipeCategory, RecipesViewModel, TrendingRecipeData} from "./model";

const filters: RecipeCategory[] = [
  {id: "all", label: "All"},
  {id: "breakfast", label: "Breakfast"},
  {id: "lunch", label: "Lunch"},
  {id: "dinner", label: "Dinner"},
  {id: "snacks", label: "Snacks"},
  {id: "high-protein", label: "High Protein"},
  {id: "low-carb", label: "Low Carb"},
  {id: "vegan", label: "Vegan"}
];

const trending: TrendingRecipeData[] = [
  {id: "post-run-power-smoothie", title: "Post-Run Power Smoothie", calories: 280, minutes: 5, visual: "smoothie", imageAlt: "Green smoothie bowl with berries and seeds"},
  {id: "classic-lean-muscle-plate", title: "Classic Lean Muscle Plate", calories: 540, minutes: 20, visual: "quinoa", imageAlt: "Lean protein plate with quinoa and greens"},
  {id: "elite-overnight-oats", title: "Elite Overnight Oats", calories: 320, minutes: 5, visual: "oats", imageAlt: "Overnight oats with fruit in a glass jar"}
];

const recipes: RecipeCardData[] = [
  {
    id: "seared-salmon-wild-rice",
    title: "Seared Salmon & Wild Rice",
    minutes: 25,
    tags: ["High Protein", "Easy Prep"],
    metrics: [
      {key: "cal", label: "Cal", value: 580, unit: ""},
      {key: "protein", label: "P", value: 42, unit: "g"},
      {key: "carbs", label: "C", value: 38, unit: "g"},
      {key: "fat", label: "F", value: 22, unit: "g"}
    ],
    visual: "salmon",
    imageAlt: "Seared salmon with asparagus and wild rice",
    defaultFavorite: false
  },
  {
    id: "elite-vegan-power-bowl",
    title: "Elite Vegan Power Bowl",
    minutes: 15,
    tags: ["Vegan", "Low Carb"],
    metrics: [
      {key: "cal", label: "Cal", value: 410, unit: ""},
      {key: "protein", label: "P", value: 18, unit: "g"},
      {key: "carbs", label: "C", value: 52, unit: "g"},
      {key: "fat", label: "F", value: 14, unit: "g"}
    ],
    visual: "vegan-bowl",
    imageAlt: "Vegan power bowl with roasted vegetables and greens",
    defaultFavorite: false
  },
  {
    id: "lean-ginger-beef-stir-fry",
    title: "Lean Ginger Beef Stir-fry",
    minutes: 20,
    tags: ["Dinner", "High Protein"],
    metrics: [
      {key: "cal", label: "Cal", value: 490, unit: ""},
      {key: "protein", label: "P", value: 38, unit: "g"},
      {key: "carbs", label: "C", value: 28, unit: "g"},
      {key: "fat", label: "F", value: 18, unit: "g"}
    ],
    visual: "stir-fry",
    imageAlt: "Lean beef and vegetable stir-fry in a pan",
    defaultFavorite: false
  },
  {
    id: "avocado-egg-sourdough",
    title: "Avocado & Egg Sourdough",
    minutes: 10,
    tags: ["Breakfast", "Healthy Fats"],
    metrics: [
      {key: "cal", label: "Cal", value: 380, unit: ""},
      {key: "protein", label: "P", value: 16, unit: "g"},
      {key: "carbs", label: "C", value: 32, unit: "g"},
      {key: "fat", label: "F", value: 24, unit: "g"}
    ],
    visual: "avocado",
    imageAlt: "Avocado and egg on sourdough toast",
    defaultFavorite: false
  }
];

const model: RecipesViewModel = {
  locale: "en-US",
  productName: "Recipes",
  searchPlaceholder: "Search elite recipes...",
  topbarActions: {
    calendarLabel: "Calendar",
    notificationsLabel: "Notifications"
  },
  featured: {
    title: "Mediterranean Quinoa Salad",
    badge: "Featured Selection",
    description: "Engineered for recovery. High fiber, high protein, and packed with micro-nutrients to fuel your post-training window.",
    minutes: 15,
    calories: 420,
    protein: "24g Protein",
    ctaLabel: "Start Cooking",
    visual: "quinoa",
    imageAlt: "Mediterranean quinoa salad with herbs and lemon"
  },
  trending,
  seasonal: {
    title: "Seasonal: Spring Fuel",
    body: "Optimized for outdoor training season. Fresh, crisp, and high-energy ingredients.",
    ctaLabel: "Explore Seasonal"
  },
  filters,
  selectedFilterId: "all",
  recipes,
  floatingActionLabel: "Recipe cooking action",
  safetyDisclosure: "Deterministic local demo recipe content. No personal health data is collected, persisted, transmitted, inferred, or used for medical advice.",
  sectionStates: {
    hero: "ready",
    discovery: "ready",
    filters: "ready",
    recipes: "ready"
  }
};

export const fixtureRecipesProvider = {
  getRecipes: async () => structuredClone(model)
};
