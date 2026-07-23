import {describe, expect, it} from "vitest";
import {clampProgress, formatCalories, formatMacro, formatNumber, formatTargetPair} from "@/features/meal-planner/format";

describe("meal planner formatting", () => {
  it("formats reference numbers and target pairs", () => {
    expect(formatNumber(14200)).toBe("14,200");
    expect(formatMacro(920, "g")).toBe("920g");
    expect(formatCalories(420)).toBe("420 kcal");
    expect(formatTargetPair(14200, 17500, "")).toBe("14,200 of 17,500");
    expect(formatTargetPair(920, 1050, "g")).toBe("920g of 1,050g");
  });

  it("clamps progress to valid progressbar bounds", () => {
    expect(clampProgress(-10, 100)).toBe(0);
    expect(clampProgress(81, 100)).toBe(81);
    expect(clampProgress(920, 1050)).toBe(88);
    expect(clampProgress(120, 100)).toBe(100);
    expect(clampProgress(20, 0)).toBe(0);
    expect(clampProgress(Number.NaN, 100)).toBe(0);
  });
});
