import {fireEvent, render, screen, within} from "@testing-library/react";
import {describe, expect, it, vi} from "vitest";
import {MealPlannerScreen} from "@/components/meal-planner/meal-planner-screen";
import {fixtureMealPlannerProvider} from "@/features/meal-planner/fixture-meal-planner-provider";
import type {MealPlannerSectionName, MealPlannerSectionStatus} from "@/features/meal-planner/model";

const sectionLabels: Record<MealPlannerSectionName, string> = {
  targets: "Weekly Nutrition Target",
  grocery: "Grocery List",
  planner: "Meal Plan"
};

describe("Meal Planner screen", () => {
  it("renders route hierarchy, topbar controls, and active sidebar state", async () => {
    render(<MealPlannerScreen model={await fixtureMealPlannerProvider.getMealPlanner()} />);
    expect(screen.getByRole("heading", {name: "Meal Planner", level: 1})).toBeInTheDocument();
    expect(screen.getByRole("searchbox", {name: "Search recipes"})).toHaveAttribute("placeholder", "Search recipes...");
    expect(screen.getByRole("button", {name: "Quick Add"})).toBeInTheDocument();
    expect(screen.getByRole("button", {name: "Open calendar"})).toBeInTheDocument();
    expect(screen.getByRole("button", {name: "Notifications, 1 unread"})).toBeInTheDocument();
    const nav = screen.getByRole("navigation", {name: "Dashboard sections"});
    expect(within(nav).getByRole("link", {name: "Meal Planner"})).toHaveAttribute("href", "/meal-planner");
    expect(within(nav).getByRole("link", {name: "Meal Planner"})).toHaveAttribute("aria-current", "page");
    expect(document.querySelector(".avilo-sidebar-nav")?.querySelectorAll(".avilo-sidebar-item")).toHaveLength(8);
    expect(document.querySelector(".avilo-sidebar-settings")?.querySelectorAll(".avilo-sidebar-item")).toHaveLength(1);
  });

  it("renders exact weekly target values and accessible progress equivalents", async () => {
    render(<MealPlannerScreen model={await fixtureMealPlannerProvider.getMealPlanner()} />);
    expect(screen.getByText("14,200")).toBeInTheDocument();
    expect(screen.getByText("Calories / 17,500")).toBeInTheDocument();
    expect(screen.getByText("920g")).toBeInTheDocument();
    expect(screen.getByText("Protein / 1,050g")).toBeInTheDocument();
    expect(screen.getByText("340g")).toBeInTheDocument();
    expect(screen.getByText("Fats / 420g")).toBeInTheDocument();
    expect(screen.getByRole("progressbar", {name: /Calories: 14,200 of 17,500, 81%/i})).toBeInTheDocument();
    expect(screen.getByRole("progressbar", {name: /Protein: 920g of 1,050g/i})).toBeInTheDocument();
    expect(screen.getByRole("img", {name: "82% weekly target progress, ON TRACK"})).toBeInTheDocument();
    expect(screen.getByText("ON TRACK")).toBeInTheDocument();
  });

  it("supports local day selection, search text, and bounded feedback without storage writes", async () => {
    const setItem = vi.spyOn(Storage.prototype, "setItem");
    const pushState = vi.spyOn(history, "pushState");
    render(<MealPlannerScreen model={await fixtureMealPlannerProvider.getMealPlanner()} />);
    const search = screen.getByRole("searchbox", {name: "Search recipes"});
    fireEvent.change(search, {target: {value: "oats"}});
    expect(search).toHaveValue("oats");
    expect(screen.getByRole("button", {name: "Wednesday 14"})).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(screen.getByRole("button", {name: "Friday 16"}));
    expect(screen.getByRole("button", {name: "Friday 16"})).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText("Selected Friday 16.")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", {name: "Generate Grocery List"}));
    expect(screen.getByText("Grocery list generation is not connected in this demo.")).toBeInTheDocument();
    expect(screen.getByText("Avocado Toast & Poached Egg")).toBeInTheDocument();
    expect(setItem).not.toHaveBeenCalled();
    expect(pushState).not.toHaveBeenCalled();
    setItem.mockRestore();
    pushState.mockRestore();
  });

  it("renders exact meal order, two add slots, and the static dinner favorite state", async () => {
    render(<MealPlannerScreen model={await fixtureMealPlannerProvider.getMealPlanner()} />);
    const breakfast = screen.getByRole("heading", {name: "Breakfast"}).closest("section")!;
    expect(within(breakfast).getAllByRole("button").map(button => button.textContent?.replace(/\s+/g, " ").trim())).toEqual([
      "Mon 12Avocado Toast & Poached Egg420 kcal",
      "Tue 13Blueberry Protein Oats380 kcal",
      "Add Meal",
      "Thu 15Super Green Smoothie310 kcal",
      "Fri 16Spinach Frittata350 kcal",
      "Sat 17Greek Yogurt Parfait290 kcal",
      "Sun 18Keto Pancakes440 kcal"
    ]);
    expect(screen.getAllByRole("button", {name: /Add Meal for/i})).toHaveLength(2);
    expect(screen.getByRole("button", {name: /Pan-Seared Scallops, Dinner, Wednesday 14, 420 kcal, favorite/i})).toBeInTheDocument();
    expect(screen.getByText("FAVORITE")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", {name: /Pan-Seared Scallops/i}));
    expect(screen.getByText("FAVORITE")).toBeInTheDocument();
  });

  it("represents independent section states and retry without resetting ready siblings", async () => {
    const names: MealPlannerSectionName[] = ["targets", "grocery", "planner"];
    for (const status of ["loading", "empty", "error"] as MealPlannerSectionStatus[]) {
      for (const name of names) {
        const model = await fixtureMealPlannerProvider.getMealPlanner();
        model.sectionStates[name] = status;
        const view = render(<MealPlannerScreen model={model} />);
        if (status === "loading") {
          expect(screen.getByText(`${sectionLabels[name]} is loading.`)).toBeInTheDocument();
        } else {
          expect(screen.getByText(status === "error" ? /could not load/i : /has no available demo data/i)).toBeInTheDocument();
          fireEvent.click(screen.getByRole("button", {name: "Retry section"}));
          expect(screen.getByText(`${sectionLabels[name]} restored.`)).toBeInTheDocument();
        }
        view.unmount();
      }
    }
  });
});
