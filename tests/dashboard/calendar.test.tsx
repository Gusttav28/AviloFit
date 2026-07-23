import {fireEvent,render,screen,waitFor} from "@testing-library/react";
import {describe,expect,it,vi} from "vitest";
import {DayStrip} from "@/components/dashboard/day-strip";
import {fixtureDashboardProvider} from "@/features/dashboard/fixture-dashboard-provider";

describe("calendar",()=>{
  it("selects bounded migrated dates and identifies today",async()=>{const model=await fixtureDashboardProvider.getDashboard(),onSelect=vi.fn();render(<DayStrip days={model.days} selected={model.selectedDate} onSelect={onSelect} locale={model.locale} timeZone={model.timeZone}/>);fireEvent.click(screen.getByRole("button",{name:/Tuesday, July 21/}));expect(onSelect).toHaveBeenCalledWith("2026-07-21");const trigger=screen.getByRole("button",{name:"Open calendar"});fireEvent.click(trigger);expect(screen.getByRole("button",{name:/Thu, Jul 23.*Today/})).toBeInTheDocument();fireEvent.keyDown(screen.getByRole("dialog"),{key:"Escape"});await waitFor(()=>expect(trigger).toHaveFocus())});
  it("closes after choosing a dialog date",async()=>{const model=await fixtureDashboardProvider.getDashboard(),onSelect=vi.fn();render(<DayStrip days={model.days} selected={model.selectedDate} onSelect={onSelect} locale={model.locale} timeZone={model.timeZone}/>);fireEvent.click(screen.getByRole("button",{name:"Open calendar"}));fireEvent.click(screen.getByRole("dialog").querySelector('button[aria-pressed="false"]')!);await waitFor(()=>expect(screen.queryByRole("dialog")).not.toBeInTheDocument());expect(onSelect).toHaveBeenCalled()});
});
