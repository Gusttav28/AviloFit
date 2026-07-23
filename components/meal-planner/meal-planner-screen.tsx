"use client";

import {useState, type ReactNode} from "react";
import {Bell, CalendarDays, CirclePlus, Plus, Search, ShoppingCart, Sparkles, Sun, Utensils} from "lucide-react";
import {DashboardShell} from "@/components/dashboard/dashboard-shell";
import {clampProgress, formatCalories, formatMacro, formatNumber, formatTargetPair} from "@/features/meal-planner/format";
import type {
  MealBandData,
  MealCardData,
  MealPlannerDay,
  MealPlannerSectionName,
  MealPlannerSectionStatus,
  MealPlannerViewModel,
  MealSlot,
  WeeklyTarget
} from "@/features/meal-planner/model";
import {isAddMealSlot} from "@/features/meal-planner/model";

const sectionLabels: Record<MealPlannerSectionName, string> = {
  targets: "Weekly Nutrition Target",
  grocery: "Grocery List",
  planner: "Meal Plan"
};

const boundedMessages = {
  quickAdd: "Quick Add is a local demo control. Meal editing is not connected.",
  grocery: "Grocery list generation is not connected in this demo.",
  calendar: "Calendar is a local demo control. No date changed.",
  notifications: "Notifications are presentation-only in this demo.",
  addMeal: "Add Meal is not connected in this demo.",
  mealCard: "Meal cards are presentation-only in this demo.",
  magic: "Smart planning is not connected in this demo.",
  floatingAdd: "Floating add is not connected in this demo."
};

export function MealPlannerScreen({model}: {model: MealPlannerViewModel}) {
  const [searchValue, setSearchValue] = useState("");
  const [selectedDayId, setSelectedDayId] = useState(model.initialSelectedDayId);
  const [message, setMessage] = useState(`Selected ${model.days.find(day => day.id === model.initialSelectedDayId)?.accessibleLabel ?? "Wednesday 14"}.`);
  const [sectionStates, setSectionStates] = useState(model.sectionStates);

  const retry = (name: MealPlannerSectionName) => {
    setSectionStates(current => ({...current, [name]: "ready"}));
    setMessage(`${sectionLabels[name]} restored.`);
  };

  const section = (name: MealPlannerSectionName, content: ReactNode) =>
    sectionStates[name] === "ready" ? content : <MealPlannerState state={sectionStates[name]} name={sectionLabels[name]} onRetry={() => retry(name)} />;

  const selectDay = (dayId: string) => {
    const day = model.days.find(item => item.id === dayId);
    if (!day) return;
    setSelectedDayId(day.id);
    setMessage(`Selected ${day.accessibleLabel}.`);
  };

  const announce = (next: string) => setMessage(next);

  return (
    <DashboardShell currentSection="Meal Planner">
      <main id="main" className="meal-planner-page" aria-label="Meal Planner">
        <MealPlannerTopbar
          productName={model.productName}
          searchPlaceholder={model.searchPlaceholder}
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          onAction={announce}
        />
        <p className="sr-only">{model.safetyDisclosure}</p>
        <p className="sr-only" aria-live="polite">{message}</p>
        <div className="meal-planner-content">
          <div className="meal-planner-summary-row">
            {section("targets", <WeeklyTargetSummary targets={model.targets} locale={model.locale} overallProgressPercent={model.overallProgressPercent} overallProgressLabel={model.overallProgressLabel} />)}
            {section("grocery", <GroceryListCta title={model.groceryCta.title} body={model.groceryCta.body} onAction={() => announce(boundedMessages.grocery)} />)}
          </div>
          {section("planner", (
            <section className="meal-planner-grid-section" aria-labelledby="meal-plan-heading">
              <h2 id="meal-plan-heading" className="sr-only">Meal Plan</h2>
              <DaySelector days={model.days} selectedDayId={selectedDayId} onSelect={selectDay} />
              <div className="meal-planner-bands" aria-label="Weekly meal plan">
                {model.bands.map(band => (
                  <MealBand key={band.mealType} band={band} days={model.days} locale={model.locale} onAction={announce} />
                ))}
              </div>
            </section>
          ))}
        </div>
        <FloatingActions onAction={announce} />
      </main>
    </DashboardShell>
  );
}

function MealPlannerTopbar({
  productName,
  searchPlaceholder,
  searchValue,
  onSearchChange,
  onAction
}: {
  productName: string;
  searchPlaceholder: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onAction: (message: string) => void;
}) {
  return (
    <header className="meal-planner-topbar">
      <h1>{productName}</h1>
      <label className="meal-planner-search">
        <Search size={21} aria-hidden="true" />
        <span className="sr-only">Search recipes</span>
        <input
          type="search"
          value={searchValue}
          placeholder={searchPlaceholder}
          aria-label="Search recipes"
          onChange={event => onSearchChange(event.target.value)}
        />
      </label>
      <div className="meal-planner-topbar-actions">
        <button className="meal-planner-quick-add" type="button" onClick={() => onAction(boundedMessages.quickAdd)}>
          <Plus size={18} aria-hidden="true" />
          Quick Add
        </button>
        <button className="meal-planner-icon-button" type="button" aria-label="Open calendar" onClick={() => onAction(boundedMessages.calendar)}>
          <CalendarDays size={22} aria-hidden="true" />
        </button>
        <button className="meal-planner-icon-button" type="button" aria-label="Notifications, 1 unread" onClick={() => onAction(boundedMessages.notifications)}>
          <Bell size={22} aria-hidden="true" />
          <span className="meal-planner-unread" aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}

function WeeklyTargetSummary({
  targets,
  locale,
  overallProgressPercent,
  overallProgressLabel
}: {
  targets: WeeklyTarget[];
  locale: string;
  overallProgressPercent: number;
  overallProgressLabel: string;
}) {
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - clampProgress(overallProgressPercent, 100) / 100);

  return (
    <section className="meal-planner-target-card" aria-labelledby="weekly-target-heading">
      <div className="meal-planner-target-metrics">
        <h2 id="weekly-target-heading">Weekly Nutrition Target</h2>
        <div className="meal-planner-target-list">
          {targets.map(target => {
            const progress = clampProgress(target.consumed, target.target);
            return (
              <div className="meal-planner-target" key={target.id}>
                <strong>{formatMacro(target.consumed, target.unit, locale)}</strong>
                <span>{target.label} / {formatMacro(target.target, target.unit, locale)}</span>
                <div
                  className="meal-planner-progressbar"
                  role="progressbar"
                  aria-label={`${target.label}: ${formatTargetPair(target.consumed, target.target, target.unit, locale)}, ${progress}%`}
                  aria-valuenow={target.consumed}
                  aria-valuemin={0}
                  aria-valuemax={target.target}
                >
                  <i style={{width: `${progress}%`}} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="meal-planner-overall" role="img" aria-label={`${overallProgressPercent}% weekly target progress, ${overallProgressLabel}`}>
        <svg viewBox="0 0 80 80" aria-hidden="true">
          <circle className="meal-planner-ring-track" cx="40" cy="40" r={radius} />
          <circle className="meal-planner-ring-value" cx="40" cy="40" r={radius} strokeDasharray={circumference} strokeDashoffset={offset} />
        </svg>
        <strong>{formatNumber(overallProgressPercent, locale)}%</strong>
        <span>{overallProgressLabel}</span>
      </div>
    </section>
  );
}

function GroceryListCta({title, body, onAction}: {title: string; body: string; onAction: () => void}) {
  return (
    <button type="button" className="meal-planner-grocery-cta" aria-label={title} onClick={onAction}>
      <ShoppingCart size={34} aria-hidden="true" />
      <span>
        <strong>{title}</strong>
        <small>{body}</small>
      </span>
    </button>
  );
}

function DaySelector({days, selectedDayId, onSelect}: {days: MealPlannerDay[]; selectedDayId: string; onSelect: (id: string) => void}) {
  return (
    <div className="meal-planner-day-selector" role="group" aria-label="Reference week day selector">
      {days.map(day => (
        <button
          key={day.id}
          type="button"
          className="meal-planner-day"
          aria-label={day.accessibleLabel}
          aria-pressed={day.id === selectedDayId}
          onClick={() => onSelect(day.id)}
        >
          {day.label}
        </button>
      ))}
    </div>
  );
}

function MealBand({band, days, locale, onAction}: {band: MealBandData; days: MealPlannerDay[]; locale: string; onAction: (message: string) => void}) {
  const Icon = band.icon === "sun" ? Sun : band.icon === "lunch" ? ShoppingCart : Utensils;

  return (
    <section className="meal-planner-band" aria-labelledby={`meal-band-${band.mealType.toLowerCase()}`}>
      <header className="meal-planner-band-header">
        <Icon size={18} aria-hidden="true" />
        <h3 id={`meal-band-${band.mealType.toLowerCase()}`}>{band.mealType}</h3>
      </header>
      <div className="meal-planner-slot-grid">
        {band.slots.map((slot, index) => (
          <div className="meal-planner-slot" key={slot.id} data-day={days[index]?.label}>
            {isAddMealSlot(slot) ? (
              <AddMealSlot slot={slot} day={days[index]} onAction={() => onAction(boundedMessages.addMeal)} />
            ) : (
              <MealCard meal={slot} day={days[index]} locale={locale} onAction={() => onAction(boundedMessages.mealCard)} />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function MealCard({meal, day, locale, onAction}: {meal: MealCardData; day?: MealPlannerDay; locale: string; onAction: () => void}) {
  return (
    <button
      type="button"
      className="meal-planner-card"
      aria-label={`${meal.name}, ${meal.mealType}, ${day?.accessibleLabel ?? meal.dayId}, ${formatCalories(meal.calories, locale)}${meal.favorite ? ", favorite" : ""}`}
      onClick={onAction}
    >
      {meal.favorite && <span className="meal-planner-favorite">FAVORITE<span className="sr-only"> favorite meal</span></span>}
      {meal.visual && (
        <span className={`meal-planner-visual meal-planner-visual-${meal.visual}`} role="img" aria-label={meal.imageAlt ?? `${meal.name} visual`} />
      )}
      <span className="meal-planner-card-day">{day?.label}</span>
      <strong>{meal.name}</strong>
      <small>{formatCalories(meal.calories, locale)}</small>
    </button>
  );
}

function AddMealSlot({slot, day, onAction}: {slot: MealSlot; day?: MealPlannerDay; onAction: () => void}) {
  return (
    <button type="button" className="meal-planner-add-slot" aria-label={`Add Meal for ${slot.mealType} on ${day?.accessibleLabel ?? slot.dayId}`} onClick={onAction}>
      <CirclePlus size={24} aria-hidden="true" />
      <strong>Add Meal</strong>
    </button>
  );
}

function FloatingActions({onAction}: {onAction: (message: string) => void}) {
  return (
    <div className="meal-planner-floating-actions" aria-label="Meal planner quick actions">
      <button type="button" className="meal-planner-floating secondary" aria-label="Smart planning suggestions" onClick={() => onAction(boundedMessages.magic)}>
        <Sparkles size={22} aria-hidden="true" />
      </button>
      <button type="button" className="meal-planner-floating primary" aria-label="Add meal from floating action" onClick={() => onAction(boundedMessages.floatingAdd)}>
        <Plus size={28} aria-hidden="true" />
      </button>
    </div>
  );
}

function MealPlannerState({state, name, onRetry}: {state: MealPlannerSectionStatus; name: string; onRetry: () => void}) {
  return (
    <section className="meal-planner-state-card" aria-label={`${name} state`}>
      {state === "loading" ? (
        <>
          <span className="sr-only">{name} is loading.</span>
          <div className="meal-planner-skeleton" aria-hidden="true" />
        </>
      ) : (
        <div role={state === "error" ? "alert" : "status"}>
          <h2>{name}</h2>
          <p>{state === "error" ? `${name} could not load. Other meal planner sections were not affected.` : `${name} has no available demo data for this week yet.`}</p>
          <button type="button" onClick={onRetry}>Retry section</button>
        </div>
      )}
    </section>
  );
}
