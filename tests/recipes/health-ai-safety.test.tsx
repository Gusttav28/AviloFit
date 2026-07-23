import {fireEvent, render, screen} from "@testing-library/react";
import {describe, expect, it, vi} from "vitest";
import {RecipesScreen} from "@/components/recipes/recipes-screen";
import {fixtureRecipesProvider} from "@/features/recipes/fixture-recipes-provider";

describe("Recipes safety and privacy", () => {
  it("does not render unsafe health, medical, personalization, or AI claims", async () => {
    render(<RecipesScreen model={await fixtureRecipesProvider.getRecipes()} />);
    const text = document.body.textContent ?? "";
    expect(text).not.toMatch(/diagnos|treat|cure|clinical|doctor|personalized|your health data|AI generated|model-generated/i);
    expect(text).toMatch(/demo recipe content/i);
  });

  it("does not use remote runtime asset URLs or write browser state during interactions", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    const storageSet = vi.spyOn(Storage.prototype, "setItem");
    const pushState = vi.spyOn(history, "pushState");
    render(<RecipesScreen model={await fixtureRecipesProvider.getRecipes()} />);
    fireEvent.click(screen.getByRole("button", {name: "Calendar"}));
    fireEvent.click(screen.getByRole("button", {name: "Notifications"}));
    fireEvent.click(screen.getByRole("button", {name: "Start Cooking"}));
    fireEvent.click(screen.getByRole("button", {name: "Explore Seasonal"}));
    fireEvent.click(screen.getByRole("button", {name: "Add Seared Salmon & Wild Rice to local favorites"}));
    fireEvent.click(screen.getAllByRole("button", {name: "Quick Add to Meal Planner"})[0]);
    fireEvent.click(screen.getByRole("button", {name: "Recipe cooking action"}));
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(storageSet).not.toHaveBeenCalled();
    expect(pushState).not.toHaveBeenCalled();
    const imageAndVisualSources = [
      ...Array.from(document.querySelectorAll("img")).map(image => image.getAttribute("src") ?? ""),
      ...Array.from(document.querySelectorAll("[class*='recipes-visual']")).map(element => element.getAttribute("style") ?? "")
    ].join(" ");
    expect(imageAndVisualSources).not.toMatch(/https?:\/\//i);
    fetchSpy.mockRestore();
    storageSet.mockRestore();
    pushState.mockRestore();
  });
});
