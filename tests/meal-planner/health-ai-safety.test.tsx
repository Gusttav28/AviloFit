import {fireEvent, render, screen} from "@testing-library/react";
import {describe, expect, it, vi} from "vitest";
import {MealPlannerScreen} from "@/components/meal-planner/meal-planner-screen";
import {fixtureMealPlannerProvider} from "@/features/meal-planner/fixture-meal-planner-provider";

describe("Meal Planner health, AI, and side-effect boundaries", () => {
  it("keeps copy bounded to deterministic local demo meal planning", async () => {
    const {container} = render(<MealPlannerScreen model={await fixtureMealPlannerProvider.getMealPlanner()} />);
    expect(screen.getByText(/Deterministic local demo meal-planning data/i)).toBeInTheDocument();
    expect(container).not.toHaveTextContent(/diagnosis|treatment|clinical certainty|professional nutrition relationship|real AI|personalized medical advice/i);
    expect(screen.getByText("Generate Grocery List")).toBeInTheDocument();
    expect(screen.getByText("Based on your weekly meals")).toBeInTheDocument();
  });

  it("does not render remote images or write network, storage, or URL state from controls", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    const setItem = vi.spyOn(Storage.prototype, "setItem");
    const replaceState = vi.spyOn(history, "replaceState");
    const pushState = vi.spyOn(history, "pushState");
    const {container} = render(<MealPlannerScreen model={await fixtureMealPlannerProvider.getMealPlanner()} />);
    const runtimeUrls = Array.from(container.querySelectorAll("[src],[href]"))
      .map(node => node.getAttribute("src") ?? node.getAttribute("href") ?? "")
      .filter(value => /^https?:\/\//i.test(value));
    expect(runtimeUrls).toEqual([]);
    fireEvent.click(screen.getByRole("button", {name: "Quick Add"}));
    fireEvent.click(screen.getByRole("button", {name: "Open calendar"}));
    fireEvent.click(screen.getByRole("button", {name: "Notifications, 1 unread"}));
    fireEvent.click(screen.getByRole("button", {name: "Add Meal for Breakfast on Wednesday 14"}));
    fireEvent.click(screen.getByRole("button", {name: "Smart planning suggestions"}));
    fireEvent.click(screen.getByRole("button", {name: "Add meal from floating action"}));
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(setItem).not.toHaveBeenCalled();
    expect(replaceState).not.toHaveBeenCalled();
    expect(pushState).not.toHaveBeenCalled();
    fetchSpy.mockRestore();
    setItem.mockRestore();
    replaceState.mockRestore();
    pushState.mockRestore();
  });
});
