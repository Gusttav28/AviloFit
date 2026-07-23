import {fireEvent, render, screen, within} from "@testing-library/react";
import {describe, expect, it, vi} from "vitest";
import {NutritionScreen} from "@/components/nutrition/nutrition-screen";
import {fixtureNutritionProvider} from "@/features/nutrition/fixture-nutrition-provider";
import type {NutritionSectionName, NutritionSectionStatus} from "@/features/nutrition/model";

const labels: Record<NutritionSectionName, string> = {
  calories: "Daily Calories",
  macros: "Macro Distribution",
  hydration: "Hydration",
  meals: "Meal History",
  recommendations: "AI Recommendations",
  recipes: "Discover Recipes"
};

describe("Nutrition screen", () => {
  it("renders the Nutrition route hierarchy with sidebar active state and topbar controls", async () => {
    render(<NutritionScreen model={await fixtureNutritionProvider.getNutrition()} />);
    expect(screen.getByRole("heading", {name: "FitCore", level: 1})).toBeInTheDocument();
    expect(screen.getByRole("searchbox", {name: "Search foods and recipes"})).toHaveAttribute("placeholder", "Search foods, recipes...");
    expect(screen.getByRole("button", {name: "Quick Add"})).toBeInTheDocument();
    expect(screen.getByRole("button", {name: "Notifications, 1 unread"})).toBeInTheDocument();
    expect(screen.getByRole("button", {name: "Open calendar"})).toBeInTheDocument();
    const nav = screen.getByRole("navigation", {name: "Dashboard sections"});
    expect(within(nav).getByRole("link", {name: "Dashboard"})).toHaveAttribute("href", "/dashboard");
    expect(within(nav).getByRole("link", {name: "Activity"})).toHaveAttribute("href", "/activity");
    expect(within(nav).getByRole("link", {name: "Nutrition"})).toHaveAttribute("href", "/nutrition");
    expect(within(nav).getByRole("link", {name: "Nutrition"})).toHaveAttribute("aria-current", "page");
  });

  it("renders calorie, macro, meal, recommendation, and recipe reference values", async () => {
    render(<NutritionScreen model={await fixtureNutritionProvider.getNutrition()} />);
    expect(screen.getByRole("img", {name: /1,420 calories consumed of 2,100 kcal/i})).toBeInTheDocument();
    expect(screen.getByText("680")).toBeInTheDocument();
    expect(screen.getByText("+340")).toBeInTheDocument();
    expect(screen.getByRole("progressbar", {name: "Protein: 112g of 140g"})).toBeInTheDocument();
    expect(screen.getByRole("progressbar", {name: "Carbs: 185g of 220g"})).toBeInTheDocument();
    expect(screen.getByRole("progressbar", {name: "Fats: 42g of 65g"})).toBeInTheDocument();
    expect(screen.getByText("Fiber: 24g")).toBeInTheDocument();
    expect(screen.getByText("Sugar: 32g")).toBeInTheDocument();
    expect(screen.getByText("Steel-cut Oats with Berries")).toBeInTheDocument();
    expect(screen.getByText("Grilled Salmon & Avocado Salad")).toBeInTheDocument();
    expect(screen.getByText("Lemon Garlic Cod")).toBeInTheDocument();
    expect(screen.getByRole("button", {name: "View Quinoa Power Bowl recipe"})).toBeInTheDocument();
    expect(screen.getByRole("button", {name: "View Lean Turkey Wrap recipe"})).toBeInTheDocument();
  });

  it("increments hydration locally, caps at target, and exposes a live status", async () => {
    const setItem = vi.spyOn(Storage.prototype, "setItem");
    render(<NutritionScreen model={await fixtureNutritionProvider.getNutrition()} />);
    const add = screen.getByRole("button", {name: "Add 250ml"});
    expect(screen.getByText("2,100")).toBeInTheDocument();
    fireEvent.click(add);
    expect(screen.getByText("2,350")).toBeInTheDocument();
    expect(screen.getByText(/Hydration updated to 2,350 of 3,000 ml/i)).toBeInTheDocument();
    fireEvent.click(add);
    fireEvent.click(add);
    fireEvent.click(add);
    fireEvent.click(add);
    expect(screen.getByText("3,000")).toBeInTheDocument();
    expect(screen.queryByText("3,100")).not.toBeInTheDocument();
    expect(setItem).not.toHaveBeenCalled();
    setItem.mockRestore();
  });

  it("keeps AI and health copy bounded to demo non-medical guidance", async () => {
    const {container} = render(<NutritionScreen model={await fixtureNutritionProvider.getNutrition()} />);
    expect(screen.getByText(/Informational demo guidance only/i)).toBeInTheDocument();
    expect(screen.getByText(/not medical advice/i)).toBeInTheDocument();
    expect(screen.getByText(/Deterministic local demo nutrition data/i)).toBeInTheDocument();
    expect(container).not.toHaveTextContent(/treatment plan|guaranteed|connected device|clinical/i);
  });

  it("represents independent loading, empty, and error states with isolated retry", async () => {
    const names: NutritionSectionName[] = ["calories", "macros", "hydration", "meals", "recommendations", "recipes"];
    for (const status of ["loading", "empty", "error"] as NutritionSectionStatus[]) {
      for (const name of names) {
        const model = await fixtureNutritionProvider.getNutrition();
        model.sectionStates[name] = status;
        const view = render(<NutritionScreen model={model} />);
        if (status === "error") {
          expect(screen.getByRole("alert")).toHaveTextContent("No other nutrition sections were affected");
          fireEvent.click(screen.getByRole("button", {name: "Retry section"}));
          expect(screen.getByRole("main", {name: "Nutrition dashboard"})).toBeInTheDocument();
        } else {
          expect(screen.getByText(status === "loading" ? new RegExp(`${labels[name]} is loading`) : /has no available demo data/i)).toBeInTheDocument();
        }
        view.unmount();
      }
    }
  });
});
