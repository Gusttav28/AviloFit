import {describe,expect,it} from "vitest";
import {formatCompactMetric,formatCurrency,formatDate,formatNumericMonthYear,formatPercent,formatSignedCalories,formatTime} from "@/features/dashboard/format";

describe("formatters",()=>{
  it("supports locales and currencies",()=>{expect(formatCurrency(12,"en-US","USD")).toContain("12");expect(formatCurrency(12,"de-DE","EUR")).toContain("12")});
  it("centralizes date order and honors supplied time zones",()=>{expect(formatDate("2026-07-13","en-US",undefined,"America/Costa_Rica")).toContain("Jul");expect(formatDate("2026-07-13","es-CR",{month:"long",day:"numeric"},"America/Costa_Rica")).toMatch(/13/);expect(formatDate("2026-07-13","en-NZ",{month:"long",day:"numeric"},"Pacific/Auckland")).toMatch(/Jul/)});
  it("formats meal-plan wall times without applying a second zone offset",()=>{expect(formatTime("2026-07-13","07:30","en-US","America/Costa_Rica")).toMatch(/7:30\s*AM/i);expect(formatTime("2026-07-13","13:30","en-GB","Europe/London")).toBe("13:30")});
  it("preserves a local cross-midnight meal time",()=>{expect(formatTime("2026-07-14","00:15","en-US","Pacific/Auckland")).toMatch(/12:15\s*AM/i)});
  it("formats reference metric units and percentages",()=>{expect(formatCompactMetric(3.2,"en-US","L")).toBe("3.2 L");expect(formatCompactMetric(450,"en-US","kcal")).toBe("450 kcal");expect(formatCompactMetric(8.4,"en-US","km")).toBe("8.4 km");expect(formatCompactMetric(72,"en-US","bpm")).toBe("72 bpm");expect(formatPercent(53,"en-US")).toBe("53%")});
  it("formats numeric month/year and signed calories",()=>{expect(formatNumericMonthYear("2026-07-13","en-US","America/Costa_Rica")).toBe("07 / 2026");expect(formatNumericMonthYear("2027-01-04","en-US","Pacific/Auckland")).toBe("01 / 2027");expect(formatSignedCalories(-450,"en-US")).toBe("-450 kcal");expect(formatSignedCalories(420,"en-US")).toBe("+420 kcal");expect(formatSignedCalories(1234,"de-DE")).toContain("+1.234 kcal")});
});
