"use client";

import {useState, type ReactNode} from "react";
import {ArrowRight, Bell, CalendarDays, ChevronRight, GlassWater, MoreVertical, Plus, Search, Sparkles, Utensils} from "lucide-react";
import {DashboardShell} from "@/components/dashboard/dashboard-shell";
import {formatCalories, formatMacro, formatNumber, formatSigned} from "@/features/nutrition/format";
import type {
  DailyCalories,
  Hydration,
  MacroItem,
  MealHistoryItem,
  NutritionAnalysis,
  NutritionRecommendation,
  NutritionRecipe,
  NutritionSectionName,
  NutritionSectionStatus,
  NutritionViewModel,
  SecondaryNutrient
} from "@/features/nutrition/model";

const sectionLabels: Record<NutritionSectionName, string> = {
  calories: "Daily Calories",
  macros: "Macro Distribution",
  hydration: "Hydration",
  meals: "Meal History",
  recommendations: "AI Recommendations",
  recipes: "Discover Recipes"
};

export function NutritionScreen({model}: {model: NutritionViewModel}) {
  const [searchValue, setSearchValue] = useState("");
  const [states, setStates] = useState(model.sectionStates);
  const retry = (name: NutritionSectionName) => setStates(current => ({...current, [name]: "ready"}));
  const section = (name: NutritionSectionName, content: ReactNode) =>
    states[name] === "ready" ? content : <NutritionState state={states[name]} name={sectionLabels[name]} onRetry={() => retry(name)} />;

  return (
    <DashboardShell currentSection="Nutrition">
      <main id="main" className="nutrition-dashboard" aria-label="Nutrition dashboard">
        <NutritionTopbar
          productName={model.productName}
          searchPlaceholder={model.searchPlaceholder}
          searchValue={searchValue}
          onSearchChange={setSearchValue}
        />
        <p className="sr-only">{model.safetyDisclosure}</p>
        <div className="nutrition-content">
          <div className="nutrition-grid nutrition-grid-summary">
            {section("calories", <DailyCaloriesCard data={model.calories} locale={model.locale} />)}
            {section("macros", <MacroDistributionCard macros={model.macros} nutrients={model.secondaryNutrients} />)}
          </div>
          <div className="nutrition-grid nutrition-grid-journal">
            {section("hydration", <HydrationCard data={model.hydration} locale={model.locale} />)}
            {section("meals", <MealHistoryCard meals={model.meals} analysis={model.analysis} dateLabel={model.referenceDateLabel} locale={model.locale} />)}
          </div>
          <div className="nutrition-grid nutrition-grid-discovery">
            {section("recommendations", <AiRecommendationsCard items={model.recommendations} />)}
            {section("recipes", <DiscoverRecipesCard recipes={model.recipes} />)}
          </div>
        </div>
      </main>
    </DashboardShell>
  );
}

function NutritionTopbar({
  productName,
  searchPlaceholder,
  searchValue,
  onSearchChange
}: {
  productName: string;
  searchPlaceholder: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
}) {
  return (
    <header className="nutrition-topbar">
      <h1>{productName}</h1>
      <label className="nutrition-search">
        <Search size={20} aria-hidden="true" />
        <span className="sr-only">Search foods and recipes</span>
        <input
          type="search"
          value={searchValue}
          placeholder={searchPlaceholder}
          aria-label="Search foods and recipes"
          onChange={event => onSearchChange(event.target.value)}
        />
      </label>
      <div className="nutrition-topbar-actions">
        <button className="nutrition-quick-add" type="button">
          <Plus size={18} aria-hidden="true" />
          Quick Add
        </button>
        <button className="nutrition-icon-button" type="button" aria-label="Notifications, 1 unread">
          <Bell size={20} aria-hidden="true" />
          <span className="nutrition-unread" aria-hidden="true" />
        </button>
        <button className="nutrition-icon-button" type="button" aria-label="Open calendar">
          <CalendarDays size={20} aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}

function DailyCaloriesCard({data, locale}: {data: DailyCalories; locale: string}) {
  const radius = 84;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(100, Math.max(0, (data.consumed / data.target) * 100));
  const offset = circumference * (1 - progress / 100);

  return (
    <section className="nutrition-card nutrition-calories-card" aria-labelledby="daily-calories-heading">
      <button type="button" className="nutrition-card-menu" aria-label="Daily calories options">
        <MoreVertical size={20} aria-hidden="true" />
      </button>
      <h2 id="daily-calories-heading">Daily Calories</h2>
      <div
        className="nutrition-ring"
        role="img"
        aria-label={`${formatNumber(data.consumed, locale)} calories consumed of ${formatNumber(data.target, locale)} kcal, ${formatNumber(data.remaining, locale)} remaining, exercise ${formatSigned(data.exerciseAdjustment, locale)}`}
      >
        <svg viewBox="0 0 192 192" aria-hidden="true">
          <circle className="nutrition-ring-track" cx="96" cy="96" r={radius} />
          <circle
            className="nutrition-ring-value"
            cx="96"
            cy="96"
            r={radius}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <span>
          <strong>{formatNumber(data.consumed, locale)}</strong>
          <small>of {formatCalories(data.target, locale)}</small>
        </span>
      </div>
      <div className="nutrition-calorie-stats">
        <div>
          <span>Remaining</span>
          <strong>{formatNumber(data.remaining, locale)}</strong>
        </div>
        <div>
          <span>Exercise</span>
          <strong className="nutrition-positive">{formatSigned(data.exerciseAdjustment, locale)}</strong>
        </div>
      </div>
    </section>
  );
}

function MacroDistributionCard({macros, nutrients}: {macros: MacroItem[]; nutrients: SecondaryNutrient[]}) {
  return (
    <section className="nutrition-card nutrition-macros-card" aria-labelledby="macro-heading">
      <div className="nutrition-section-heading">
        <h2 id="macro-heading">Macro Distribution</h2>
        <span className="nutrition-status-pill">Target Achieved: 72%</span>
      </div>
      <div className="nutrition-macro-grid">
        {macros.map(macro => {
          const percent = Math.round((macro.consumed / macro.target) * 100);
          return (
            <div className="nutrition-macro" key={macro.label}>
              <div className="nutrition-macro-row">
                <strong>{macro.label}</strong>
                <span>
                  <b>{formatMacro(macro.consumed, macro.unit)}</b> / {formatMacro(macro.target, macro.unit)}
                </span>
              </div>
              <div
                className="nutrition-progressbar"
                role="progressbar"
                aria-label={`${macro.label}: ${formatMacro(macro.consumed, macro.unit)} of ${formatMacro(macro.target, macro.unit)}`}
                aria-valuenow={macro.consumed}
                aria-valuemin={0}
                aria-valuemax={macro.target}
              >
                <i className={`nutrition-progress-${macro.tone}`} style={{width: `${Math.min(100, percent)}%`}} />
              </div>
              <p>{macro.guidance}</p>
            </div>
          );
        })}
      </div>
      <div className="nutrition-micro-row">
        <div className="nutrition-nutrients">
          {nutrients.map(nutrient => (
            <span className={`nutrition-nutrient nutrition-nutrient-${nutrient.tone}`} key={nutrient.label}>
              {nutrient.label}: {nutrient.value}
              {nutrient.unit}
            </span>
          ))}
        </div>
        <button type="button" className="nutrition-text-action">
          View Micro-nutrients
          <ChevronRight size={16} aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}

function HydrationCard({data, locale}: {data: Hydration; locale: string}) {
  const [consumed, setConsumed] = useState(data.consumed);
  const [filled, setFilled] = useState(data.filledGlasses);
  const [message, setMessage] = useState(`Hydration is ${formatNumber(data.consumed, locale)} of ${formatNumber(data.target, locale)} ml.`);

  const addWater = () => {
    const nextConsumed = Math.min(data.target, consumed + data.increment);
    const reachedTarget = nextConsumed === data.target;
    setConsumed(nextConsumed);
    setFilled(reachedTarget ? data.totalGlasses : Math.min(data.totalGlasses, filled + 1));
    setMessage(`Hydration updated to ${formatNumber(nextConsumed, locale)} of ${formatNumber(data.target, locale)} ml.`);
  };

  return (
    <section className="nutrition-card nutrition-hydration-card" aria-labelledby="hydration-heading">
      <h2 id="hydration-heading">Hydration</h2>
      <div className="nutrition-hydration-body">
        <p className="nutrition-hydration-total">
          <strong>{formatNumber(consumed, locale)}</strong>
          <span> / {formatNumber(data.target, locale)} ml</span>
        </p>
        <div className="nutrition-glass-row" role="img" aria-label={`${filled} of ${data.totalGlasses} hydration indicators filled`}>
          {Array.from({length: data.totalGlasses}, (_, index) => (
            <span className={index < filled ? "filled" : ""} key={index} aria-hidden="true" />
          ))}
        </div>
        <button type="button" className="nutrition-hydration-button" onClick={addWater}>
          <GlassWater size={20} aria-hidden="true" />
          Add 250ml
        </button>
        <p className="sr-only" aria-live="polite">{message}</p>
      </div>
    </section>
  );
}

function MealHistoryCard({
  meals,
  analysis,
  dateLabel,
  locale
}: {
  meals: MealHistoryItem[];
  analysis: NutritionAnalysis;
  dateLabel: string;
  locale: string;
}) {
  return (
    <section className="nutrition-card nutrition-meals-card" aria-labelledby="meal-history-heading">
      <div className="nutrition-section-heading">
        <h2 id="meal-history-heading">Meal History</h2>
        <span>{dateLabel}</span>
      </div>
      <div className="nutrition-meal-list">
        {meals.map(meal => (
          <article className="nutrition-meal" key={meal.id} aria-label={`${meal.name}, ${meal.mealType}`}>
            <div className={`nutrition-food-visual nutrition-food-${meal.visual}`} role="img" aria-label={meal.imageAlt} />
            <div className="nutrition-meal-copy">
              <div className="nutrition-meal-title">
                <h3>{meal.name}</h3>
                <strong>{formatCalories(meal.calories, locale)}</strong>
              </div>
              <p>
                {meal.mealType} <span aria-hidden="true">•</span> <time>{meal.time}</time>
              </p>
              <div className="nutrition-chip-row" aria-label={`${meal.name} macros`}>
                {meal.macros.map(macro => (
                  <span key={macro.label}>{macro.label}: {macro.value}g</span>
                ))}
              </div>
            </div>
            <button type="button" className="nutrition-edit-button" aria-label={`Edit ${meal.name}`}>
              Edit
            </button>
          </article>
        ))}
      </div>
      <aside className="nutrition-analysis" aria-label="AI nutritional analysis safety note">
        <Sparkles size={18} aria-hidden="true" />
        <div>
          <h3>{analysis.title}</h3>
          <p>{analysis.body}</p>
          <small>{analysis.disclosure}</small>
        </div>
      </aside>
    </section>
  );
}

function AiRecommendationsCard({items}: {items: NutritionRecommendation[]}) {
  return (
    <section className="nutrition-card nutrition-recommendations-card" aria-labelledby="ai-recommendations-heading">
      <div className="nutrition-recommendations-title">
        <Sparkles size={24} aria-hidden="true" />
        <h2 id="ai-recommendations-heading">AI Recommendations</h2>
      </div>
      <div className="nutrition-recommendation-list">
        {items.map(item => (
          <article className="nutrition-recommendation" key={item.id}>
            <span className={`nutrition-recommendation-icon nutrition-recommendation-icon-${item.icon}`} aria-hidden="true">
              <Utensils size={20} />
            </span>
            <div>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
              {item.actionLabel && (
                <button type="button" className="nutrition-recipe-action" aria-label={`${item.actionLabel} suggestion`}>
                  {item.actionLabel}
                  <ArrowRight size={20} aria-hidden="true" />
                </button>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function DiscoverRecipesCard({recipes}: {recipes: NutritionRecipe[]}) {
  return (
    <section className="nutrition-card nutrition-recipes-card" aria-labelledby="discover-recipes-heading">
      <div className="nutrition-section-heading">
        <h2 id="discover-recipes-heading">Discover Recipes</h2>
        <button type="button" className="nutrition-text-action">Browse All</button>
      </div>
      <div className="nutrition-recipe-grid">
        {recipes.map(recipe => (
          <button type="button" className="nutrition-recipe-card" key={recipe.id} aria-label={`View ${recipe.name} recipe`}>
            <span className={`nutrition-recipe-visual nutrition-recipe-${recipe.visual}`} role="img" aria-label={recipe.imageAlt}>
              <span>{recipe.duration}</span>
            </span>
            <strong>{recipe.name}</strong>
            <small>{recipe.descriptors.join(" • ")}</small>
          </button>
        ))}
      </div>
      <button type="button" className="nutrition-floating-add" aria-label="Quick add nutrition item">
        <Plus size={28} aria-hidden="true" />
      </button>
    </section>
  );
}

function NutritionState({
  state,
  name,
  onRetry
}: {
  state: NutritionSectionStatus;
  name: string;
  onRetry: () => void;
}) {
  return (
    <section className="nutrition-card nutrition-state-card" aria-label={`${name} state`}>
      {state === "loading" ? (
        <>
          <span className="sr-only">{name} is loading.</span>
          <div className="nutrition-skeleton" aria-hidden="true" />
        </>
      ) : (
        <div role={state === "error" ? "alert" : "status"}>
          <h2>{name}</h2>
          <p>{state === "error" ? `${name} could not load. No other nutrition sections were affected.` : `${name} has no available demo data for this day yet.`}</p>
          <button type="button" onClick={onRetry}>Retry section</button>
        </div>
      )}
    </section>
  );
}
