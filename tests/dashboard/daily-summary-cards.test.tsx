import {fireEvent,render,screen,within} from "@testing-library/react";
import {useState} from "react";
import {beforeEach,describe,expect,it,vi} from "vitest";
import {DailySummaryCards} from "@/components/dashboard/daily-summary-cards";
import {fixtureDashboardProvider} from "@/features/dashboard/fixture-dashboard-provider";
import type {DailyDashboardSnapshot,DashboardViewModel} from "@/features/dashboard/model";

let model:DashboardViewModel;
let scrollIntoView:ReturnType<typeof vi.fn>;

beforeEach(async()=>{
  model=await fixtureDashboardProvider.getDashboard();
  scrollIntoView=vi.fn();
  Object.defineProperty(HTMLElement.prototype,"scrollIntoView",{configurable:true,value:scrollIntoView});
});

function renderCards(options?:{selectedDate?:string;summariesByDate?:Record<string,DailyDashboardSnapshot>;onSelect?:(date:string)=>void}){
  const onSelect=options?.onSelect??vi.fn();
  render(<DailySummaryCards
    days={model.days}
    summariesByDate={options?.summariesByDate??model.referenceByDate}
    selectedDate={options?.selectedDate??model.selectedDate}
    onSelect={onSelect}
    locale={model.locale}
    timeZone={model.timeZone}
  />);
  return {onSelect};
}

function renderControlledCards(){
  const selections:string[]=[];
  function Harness(){
    const [selectedDate,setSelectedDate]=useState(model.selectedDate);
    return <DailySummaryCards
      days={model.days}
      summariesByDate={model.referenceByDate}
      selectedDate={selectedDate}
      onSelect={date=>{selections.push(date);setSelectedDate(date)}}
      locale={model.locale}
      timeZone={model.timeZone}
    />;
  }
  render(<Harness />);
  return {selections};
}

describe("daily summary cards",()=>{
  it("renders seven chronological cards with exact visible content and accessible names",()=>{
    renderCards();
    const region=screen.getByRole("region",{name:"Daily dashboard summaries"});
    const cards=within(region).getAllByRole("button");

    expect(cards).toHaveLength(7);
    expect(cards.map(card=>card.textContent)).toEqual([
      "20Mon2,135 kcal eaten45 min active",
      "21Tue2,220 kcal eaten50 min active",
      "22Wed2,305 kcal eaten55 min active",
      "23Thu2,390 kcal eaten60 min active",
      "24Fri2,475 kcal eaten65 min active",
      "25Sat2,560 kcal eaten70 min active",
      "26Sun2,645 kcal eaten75 min active"
    ]);
    expect(cards[0]).toHaveAccessibleName("Monday, July 20, 2026. 2,135 kcal eaten. 45 min active. Selected");
    expect(cards[6]).toHaveAccessibleName("Sunday, July 26, 2026. 2,645 kcal eaten. 75 min active.");
  });

  it("shows unavailable preview fallbacks without omitting the category",()=>{
    const summariesByDate={
      ...model.referenceByDate,
      "2026-07-22":{
        ...model.referenceByDate["2026-07-22"],
        preview:{nutrition:undefined,activity:undefined}
      }
    };

    renderCards({summariesByDate});

    const card=screen.getByRole("button",{name:"Wednesday, July 22, 2026. Nutrition unavailable. Activity unavailable."});
    expect(card).toHaveTextContent("Nutrition unavailable");
    expect(card).toHaveTextContent("Activity unavailable");
  });

  it("exposes exactly one selected card with pressed and current-date semantics",()=>{
    renderCards({selectedDate:"2026-07-23"});
    const selected=screen.getByRole("button",{name:/Thursday, July 23, 2026.*Selected/});

    expect(selected).toHaveAttribute("aria-pressed","true");
    expect(selected).toHaveAttribute("aria-current","date");
    for(const card of screen.getAllByRole("button").filter(card=>card!==selected)){
      expect(card).toHaveAttribute("aria-pressed","false");
      expect(card).not.toHaveAttribute("aria-current");
      expect(card).not.toHaveAccessibleName(/Selected/);
    }
  });

  it("routes pointer activation through the selected-date callback and keeps focus on the activated card",()=>{
    const {selections}=renderControlledCards();
    const target=screen.getByRole("button",{name:/Tuesday, July 21, 2026/});

    target.focus();
    fireEvent.click(target);

    expect(selections).toEqual(["2026-07-21"]);
    expect(document.activeElement).toBe(target);
    expect(target).toHaveAttribute("aria-pressed","true");
    expect(target).toHaveAttribute("aria-current","date");
  });

  it("supports native button keyboard activation for Enter and Space in the component harness",()=>{
    const {selections}=renderControlledCards();
    const wednesday=screen.getByRole("button",{name:/Wednesday, July 22, 2026/});
    const thursday=screen.getByRole("button",{name:/Thursday, July 23, 2026/});

    wednesday.focus();
    fireEvent.keyDown(wednesday,{key:"Enter"});
    fireEvent.click(wednesday);
    thursday.focus();
    fireEvent.keyDown(thursday,{key:" "});
    fireEvent.click(thursday);

    expect(selections).toEqual(["2026-07-22","2026-07-23"]);
    expect(document.activeElement).toBe(thursday);
    expect(thursday).toHaveAttribute("aria-pressed","true");
  });

  it("applies rapid sequential activations synchronously with the final valid card selected",()=>{
    const {selections}=renderControlledCards();
    const cards=screen.getAllByRole("button");

    fireEvent.click(cards[1]);
    fireEvent.click(cards[3]);
    fireEvent.click(cards[6]);

    expect(selections).toEqual(["2026-07-21","2026-07-23","2026-07-26"]);
    expect(cards[6]).toHaveAttribute("aria-pressed","true");
    expect(cards[6]).toHaveAttribute("aria-current","date");
    expect(cards[3]).toHaveAttribute("aria-pressed","false");
  });

  it("suppresses the initial live announcement, then announces and scrolls selected changes",()=>{
    const view=render(<DailySummaryCards
      days={model.days}
      summariesByDate={model.referenceByDate}
      selectedDate={model.selectedDate}
      onSelect={vi.fn()}
      locale={model.locale}
      timeZone={model.timeZone}
    />);
    const liveRegion=document.querySelector('[aria-live="polite"]');

    expect(liveRegion).toHaveTextContent("");
    expect(scrollIntoView).not.toHaveBeenCalled();

    view.rerender(<DailySummaryCards
      days={model.days}
      summariesByDate={model.referenceByDate}
      selectedDate="2026-07-24"
      onSelect={vi.fn()}
      locale={model.locale}
      timeZone={model.timeZone}
    />);

    expect(screen.getByText("Dashboard updated for Friday, July 24, 2026.")).toHaveAttribute("aria-live","polite");
    expect(scrollIntoView).toHaveBeenCalledWith({block:"nearest",inline:"nearest"});
  });
});
