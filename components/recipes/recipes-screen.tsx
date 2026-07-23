"use client";

import {useMemo, useState, type ReactNode} from "react";
import {Bell, CalendarDays, ChefHat, Clock3, Heart, Plus, Search, Sprout, Utensils, Zap} from "lucide-react";
import {DashboardShell} from "@/components/dashboard/dashboard-shell";
import {
  formatCalories,
  formatHeroCalories,
  formatHeroMinutes,
  formatMetricValue,
  formatMinutes,
  isReadySection,
  isValidFilterId,
  recipeMatchesFilter
} from "@/features/recipes/format";
import type {
  FeaturedRecipeData,
  RecipeCardData,
  RecipeCategory,
  RecipesSectionName,
  RecipesSectionStatus,
  RecipesViewModel,
  SeasonalPromoData,
  TrendingRecipeData
} from "@/features/recipes/model";

const sectionLabels: Record<RecipesSectionName, string> = {
  hero: "Featured Recipe",
  discovery: "Recipe Discovery",
  filters: "Recipe Filters",
  recipes: "Recipe Cards"
};

const boundedMessages = {
  calendar: "Calendar is a local demo control. No calendar was opened.",
  notifications: "Notifications are presentation-only in this demo.",
  hero: "Start Cooking is a local demo control. No cooking mode was opened.",
  seasonal: "Seasonal recipes are presentation-only in this demo.",
  quickAdd: "Quick Add is a local demo control. Meal Planner was not changed.",
  floating: "Recipe tools are presentation-only in this demo."
};

export function RecipesScreen({model}: {model: RecipesViewModel}) {
  const [searchValue, setSearchValue] = useState("");
  const [selectedFilterId, setSelectedFilterId] = useState(model.selectedFilterId);
  const [favoriteIds, setFavoriteIds] = useState(() => new Set(model.recipes.filter(recipe => recipe.defaultFavorite).map(recipe => recipe.id)));
  const [message, setMessage] = useState("Recipes ready.");
  const [sectionStates, setSectionStates] = useState(model.sectionStates);

  const visibleRecipes = useMemo(
    () => model.recipes.filter(recipe => recipeMatchesFilter(recipe, selectedFilterId)),
    [model.recipes, selectedFilterId]
  );

  const retry = (name: RecipesSectionName) => {
    setSectionStates(current => ({...current, [name]: "ready"}));
    setMessage(`${sectionLabels[name]} restored.`);
  };

  const section = (name: RecipesSectionName, content: ReactNode) =>
    isReadySection(sectionStates[name]) ? content : <RecipesState state={sectionStates[name]} name={sectionLabels[name]} onRetry={() => retry(name)} />;

  const selectFilter = (filterId: string) => {
    if (!isValidFilterId(filterId)) return;
    const filter = model.filters.find(item => item.id === filterId);
    if (!filter) return;
    setSelectedFilterId(filter.id);
    setMessage(`Selected ${filter.label}.`);
  };

  const toggleFavorite = (recipe: RecipeCardData) => {
    setFavoriteIds(current => {
      const next = new Set(current);
      if (next.has(recipe.id)) {
        next.delete(recipe.id);
        setMessage(`${recipe.title} removed from local favorites.`);
      } else {
        next.add(recipe.id);
        setMessage(`${recipe.title} added to local favorites.`);
      }
      return next;
    });
  };

  return (
    <DashboardShell currentSection="Recipes">
      <main id="main" className="recipes-page" aria-label="Recipes">
        <RecipesTopbar
          productName={model.productName}
          searchPlaceholder={model.searchPlaceholder}
          searchValue={searchValue}
          calendarLabel={model.topbarActions.calendarLabel}
          notificationsLabel={model.topbarActions.notificationsLabel}
          onSearchChange={setSearchValue}
          onAction={setMessage}
        />
        <p className="sr-only">{model.safetyDisclosure}</p>
        <p className="sr-only" aria-live="polite">{message}</p>
        <div className="recipes-content">
          {section("hero", <FeaturedRecipeHero featured={model.featured} locale={model.locale} onAction={() => setMessage(boundedMessages.hero)} />)}
          <div className="recipes-main-grid">
            <aside className="recipes-discovery-rail" aria-label="Recipe discovery">
              {section("discovery", <RecipesDiscoveryRail trending={model.trending} seasonal={model.seasonal} locale={model.locale} onAction={setMessage} />)}
            </aside>
            <section className="recipes-catalog" aria-labelledby="recipes-catalog-heading">
              <h2 id="recipes-catalog-heading" className="sr-only">Recipe Catalog</h2>
              {section("filters", <RecipeFilters filters={model.filters} selectedFilterId={selectedFilterId} onSelect={selectFilter} />)}
              {section("recipes", <RecipeGrid recipes={visibleRecipes} favoriteIds={favoriteIds} onFavorite={toggleFavorite} onAction={setMessage} />)}
            </section>
          </div>
        </div>
        <button type="button" className="recipes-floating-action" aria-label={model.floatingActionLabel} onClick={() => setMessage(boundedMessages.floating)}>
          <Utensils size={28} aria-hidden="true" />
        </button>
      </main>
    </DashboardShell>
  );
}

function RecipesTopbar({
  productName,
  searchPlaceholder,
  searchValue,
  calendarLabel,
  notificationsLabel,
  onSearchChange,
  onAction
}: {
  productName: string;
  searchPlaceholder: string;
  searchValue: string;
  calendarLabel: string;
  notificationsLabel: string;
  onSearchChange: (value: string) => void;
  onAction: (message: string) => void;
}) {
  return (
    <header className="recipes-topbar">
      <h1>{productName}</h1>
      <label className="recipes-search">
        <Search size={21} aria-hidden="true" />
        <span className="sr-only">Search elite recipes</span>
        <input
          type="search"
          value={searchValue}
          placeholder={searchPlaceholder}
          aria-label="Search elite recipes"
          onChange={event => onSearchChange(event.target.value)}
        />
      </label>
      <div className="recipes-topbar-actions">
        <button className="recipes-calendar-button" type="button" onClick={() => onAction(boundedMessages.calendar)}>
          <CalendarDays size={18} aria-hidden="true" />
          {calendarLabel}
        </button>
        <button className="recipes-icon-button" type="button" aria-label={notificationsLabel} onClick={() => onAction(boundedMessages.notifications)}>
          <Bell size={21} aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}

function FeaturedRecipeHero({featured, locale, onAction}: {featured: FeaturedRecipeData; locale: string; onAction: () => void}) {
  return (
    <section className="recipes-hero" aria-labelledby="recipes-hero-heading">
      <span className={`recipes-visual recipes-visual-${featured.visual}`} role="img" aria-label={featured.imageAlt} />
      <div className="recipes-hero-overlay" />
      <div className="recipes-hero-copy">
        <span className="recipes-kicker">{featured.badge}</span>
        <h2 id="recipes-hero-heading">{featured.title}</h2>
        <p>{featured.description}</p>
        <dl className="recipes-hero-metrics" aria-label="Featured recipe metrics">
          <div>
            <Clock3 size={18} aria-hidden="true" />
            <dt>Time</dt>
            <dd>{formatHeroMinutes(featured.minutes)}</dd>
          </div>
          <div>
            <Zap size={18} aria-hidden="true" />
            <dt>Calories</dt>
            <dd>{formatHeroCalories(featured.calories, locale)}</dd>
          </div>
          <div>
            <Sprout size={18} aria-hidden="true" />
            <dt>Protein</dt>
            <dd>{featured.protein}</dd>
          </div>
        </dl>
        <button type="button" className="recipes-primary-action" onClick={onAction}>{featured.ctaLabel}</button>
      </div>
    </section>
  );
}

function RecipesDiscoveryRail({
  trending,
  seasonal,
  locale,
  onAction
}: {
  trending: TrendingRecipeData[];
  seasonal: SeasonalPromoData;
  locale: string;
  onAction: (message: string) => void;
}) {
  return (
    <>
      <section className="recipes-trending-card" aria-labelledby="recipes-trending-heading">
        <h2 id="recipes-trending-heading"><Zap size={17} aria-hidden="true" /> Trending This Week</h2>
        <ol className="recipes-trending-list">
          {trending.map(recipe => (
            <li key={recipe.id}>
              <span className={`recipes-trending-thumb recipes-visual-${recipe.visual}`} role="img" aria-label={recipe.imageAlt} />
              <span>
                <strong>{recipe.title}</strong>
                <small>{formatCalories(recipe.calories, locale)} - {formatMinutes(recipe.minutes).replace("m", " mins")}</small>
              </span>
            </li>
          ))}
        </ol>
      </section>
      <section className="recipes-seasonal-card" aria-labelledby="recipes-seasonal-heading">
        <ChefHat size={36} aria-hidden="true" />
        <h2 id="recipes-seasonal-heading">{seasonal.title}</h2>
        <p>{seasonal.body}</p>
        <button type="button" onClick={() => onAction(boundedMessages.seasonal)}>{seasonal.ctaLabel}</button>
      </section>
    </>
  );
}

function RecipeFilters({filters, selectedFilterId, onSelect}: {filters: RecipeCategory[]; selectedFilterId: string; onSelect: (id: string) => void}) {
  return (
    <div className="recipes-filter-row" role="group" aria-label="Recipe filters">
      {filters.map(filter => (
        <button
          key={filter.id}
          type="button"
          className="recipes-filter-chip"
          aria-pressed={filter.id === selectedFilterId}
          onClick={() => onSelect(filter.id)}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}

function RecipeGrid({
  recipes,
  favoriteIds,
  onFavorite,
  onAction
}: {
  recipes: RecipeCardData[];
  favoriteIds: Set<string>;
  onFavorite: (recipe: RecipeCardData) => void;
  onAction: (message: string) => void;
}) {
  if (recipes.length === 0) {
    return (
      <section className="recipes-empty-card" aria-label="Recipe Cards empty">
        <h2>No recipes in this local filter</h2>
        <p>The demo fixture has no matching cards for this selection.</p>
      </section>
    );
  }

  return (
    <div className="recipes-grid" aria-label="Recipe cards">
      {recipes.map(recipe => (
        <RecipeCard
          key={recipe.id}
          recipe={recipe}
          favorite={favoriteIds.has(recipe.id)}
          onFavorite={() => onFavorite(recipe)}
          onQuickAdd={() => onAction(boundedMessages.quickAdd)}
        />
      ))}
    </div>
  );
}

function RecipeCard({
  recipe,
  favorite,
  onFavorite,
  onQuickAdd
}: {
  recipe: RecipeCardData;
  favorite: boolean;
  onFavorite: () => void;
  onQuickAdd: () => void;
}) {
  return (
    <article className="recipes-card">
      <div className="recipes-card-media">
        <span className={`recipes-visual recipes-visual-${recipe.visual}`} role="img" aria-label={recipe.imageAlt} />
        <button
          type="button"
          className="recipes-favorite-button"
          aria-label={`${favorite ? "Remove" : "Add"} ${recipe.title} ${favorite ? "from" : "to"} local favorites`}
          aria-pressed={favorite}
          onClick={onFavorite}
        >
          <Heart size={21} aria-hidden="true" fill={favorite ? "currentColor" : "none"} />
        </button>
        <div className="recipes-tag-row" aria-label={`${recipe.title} tags`}>
          {recipe.tags.map(tag => <span key={tag}>{tag}</span>)}
        </div>
      </div>
      <div className="recipes-card-body">
        <header className="recipes-card-title-row">
          <h3>{recipe.title}</h3>
          <span><Clock3 size={13} aria-hidden="true" /> {formatMinutes(recipe.minutes)}</span>
        </header>
        <dl className="recipes-metric-grid" aria-label={`${recipe.title} nutrition metrics`}>
          {recipe.metrics.map(metric => (
            <div key={metric.key}>
              <dt>{metric.label}</dt>
              <dd>{formatMetricValue(metric)}</dd>
            </div>
          ))}
        </dl>
        <p className="sr-only">{recipe.title} contains demo nutrition values: {recipe.metrics.map(metric => `${metric.label} ${formatMetricValue(metric)}`).join(", ")}.</p>
        <button type="button" className="recipes-quick-add" onClick={onQuickAdd}>
          <Plus size={18} aria-hidden="true" />
          Quick Add to Meal Planner
        </button>
      </div>
    </article>
  );
}

function RecipesState({state, name, onRetry}: {state: RecipesSectionStatus; name: string; onRetry: () => void}) {
  return (
    <section className="recipes-state-card" aria-label={`${name} state`}>
      {state === "loading" ? (
        <>
          <span className="sr-only">{name} is loading.</span>
          <div className="recipes-skeleton" aria-hidden="true" />
        </>
      ) : (
        <div role={state === "error" ? "alert" : "status"}>
          <h2>{name}</h2>
          <p>{state === "error" ? `${name} could not load. Other Recipes sections were not affected.` : `${name} has no available demo data right now.`}</p>
          <button type="button" onClick={onRetry}>Retry section</button>
        </div>
      )}
    </section>
  );
}
