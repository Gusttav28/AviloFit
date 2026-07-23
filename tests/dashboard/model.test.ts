import {describe,expect,it} from "vitest";
import {fixtureDashboardProvider} from "@/features/dashboard/fixture-dashboard-provider";

describe("dashboard model",()=>{
  it("returns isolated deterministic fixture state with seven dated snapshots",async()=>{const a=await fixtureDashboardProvider.getDashboard(),b=await fixtureDashboardProvider.getDashboard();a.budget.amount=1;a.referenceByDate[a.selectedDate].progressCards[0].percent="0%";expect(b.budget.amount).toBe(18);expect(b.referenceByDate[b.selectedDate].progressCards[0].percent).toBe("53%");expect(a.days.map(day=>day.date)).toEqual(["2026-07-20","2026-07-21","2026-07-22","2026-07-23","2026-07-24","2026-07-25","2026-07-26"]);expect(Object.keys(a.referenceByDate)).toEqual(a.days.map(day=>day.date));expect(a.referenceByDate["2026-07-20"].activityCards).toHaveLength(6);expect(a.referenceByDate["2026-07-20"].summary.bars).toHaveLength(7)});
  it("keeps bounded history deterministic and aligned to available dates",async()=>{const {history}= (await fixtureDashboardProvider.getDashboard()).reference;expect(history.selectedDate).toBe("2026-07-20");expect(history.availableDateRange).toEqual(["2026-07-20","2026-07-26"]);expect(history.entries.every(entry=>entry.date>="2026-07-20"&&entry.date<="2026-07-26")).toBe(true);expect(new Set(history.entries.map(entry=>entry.id)).size).toBe(history.entries.length)});
});
