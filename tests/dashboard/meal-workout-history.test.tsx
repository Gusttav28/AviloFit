import {fireEvent,render,screen,within} from "@testing-library/react";
import {useState} from "react";
import {describe,expect,it,vi} from "vitest";
import {MealWorkoutHistory} from "@/components/dashboard/meal-workout-history";
import {fixtureReferenceDashboard} from "@/features/dashboard/fixture-dashboard-provider";
import type {ReferenceHistoryData} from "@/features/dashboard/model";

const availableDates=new Set(["2026-07-20","2026-07-21","2026-07-22","2026-07-23","2026-07-24","2026-07-25","2026-07-26"]);
const baseProps={
  history:fixtureReferenceDashboard.history,
  selectedDate:"2026-07-20",
  availableDates,
  locale:"en-US",
  currency:"USD",
  timeZone:"America/Costa_Rica"
};

function renderHistory(overrides:Partial<typeof baseProps>&{onSelectDate?:(date:string)=>void}={}){
  const onSelectDate=overrides.onSelectDate??vi.fn();
  render(<MealWorkoutHistory {...baseProps} {...overrides} onSelectDate={onSelectDate} />);
  return {onSelectDate};
}

function renderControlledHistory(initialDate="2026-07-20"){
  const selections:string[]=[];
  function Harness(){
    const [selectedDate,setSelectedDate]=useState(initialDate);
    return <MealWorkoutHistory
      {...baseProps}
      selectedDate={selectedDate}
      onSelectDate={date=>{selections.push(date);setSelectedDate(date)}}
    />;
  }
  render(<Harness />);
  return {selections};
}

describe("meal and workout history",()=>{
  it("renders controlled selected date, table semantics, filtered rows, and result announcement",()=>{
    renderHistory();
    const panel=screen.getByRole("region",{name:"Meal Recipes & Workout"});
    const tableRegion=within(panel).getByRole("region",{name:"Meal and workout history table for Monday, July 20, 2026"});
    const table=within(tableRegion).getByRole("table",{name:"Meal and workout history for Monday, July 20, 2026"});

    expect(within(panel).getByText("07 / 2026")).toBeInTheDocument();
    expect(within(panel).getByRole("button",{name:"Monday, July 20, 2026"})).toHaveAttribute("aria-current","date");
    expect(within(table).getAllByRole("columnheader").map(header=>header.textContent)).toEqual(["Meal Name","Recipe","Value","Price"]);
    expect(within(table).getAllByRole("row")).toHaveLength(2);
    expect(within(table).getByText("Recovery breakfast")).toBeInTheDocument();
    expect(within(table).getByText("Garden egg toast")).toBeInTheDocument();
    expect(within(table).getByText("Workout -320 kcal")).toBeInTheDocument();
    expect(within(table).getByText("Recipe +420 kcal")).toBeInTheDocument();
    expect(within(table).getByText("$4.70")).toBeInTheDocument();
    expect(screen.getByText("Monday, July 20, 2026: 1 result.")).toHaveAttribute("aria-live","polite");
    expect(screen.getByText("Rows and estimated prices are deterministic demo data.")).toBeInTheDocument();
  });

  it("rerenders from external controlled date updates without keeping stale rows",()=>{
    const view=render(<MealWorkoutHistory {...baseProps} onSelectDate={vi.fn()} />);

    expect(screen.getByText("Recovery breakfast")).toBeInTheDocument();
    view.rerender(<MealWorkoutHistory {...baseProps} selectedDate="2026-07-22" onSelectDate={vi.fn()} />);

    expect(screen.getByRole("button",{name:"Wednesday, July 22, 2026"})).toHaveAttribute("aria-current","date");
    expect(screen.queryByText("Recovery breakfast")).not.toBeInTheDocument();
    expect(screen.getByRole("table",{name:"Meal and workout history for Wednesday, July 22, 2026"})).toBeInTheDocument();
    expect(screen.getByText("Afternoon recovery")).toBeInTheDocument();
    expect(screen.getByText("Cocoa banana bites")).toBeInTheDocument();
    expect(screen.getByText("Workout -210 kcal")).toBeInTheDocument();
    expect(screen.getByText("$2.60")).toBeInTheDocument();
  });

  it("routes date activation through the controlled callback and retains focus after rerender",()=>{
    const {selections}=renderControlledHistory();
    const tuesday=screen.getByRole("button",{name:"Tuesday, July 21, 2026"});

    tuesday.focus();
    fireEvent.click(tuesday);

    expect(selections).toEqual(["2026-07-21"]);
    expect(document.activeElement).toBe(tuesday);
    expect(tuesday).toHaveAttribute("aria-current","date");
    expect(screen.getByText("Post-workout lunch")).toBeInTheDocument();
    expect(screen.getByText("Herby chickpea bowl")).toBeInTheDocument();
  });

  it("supports native button keyboard activation for available dates",()=>{
    const {selections}=renderControlledHistory();
    const thursday=screen.getByRole("button",{name:"Thursday, July 23, 2026"});

    thursday.focus();
    fireEvent.keyDown(thursday,{key:"Enter"});
    fireEvent.click(thursday);

    expect(selections).toEqual(["2026-07-23"]);
    expect(document.activeElement).toBe(thursday);
    expect(thursday).toHaveAttribute("aria-current","date");
    expect(screen.getByText("Morning meal")).toBeInTheDocument();
    expect(screen.getByText("Apple overnight oats")).toBeInTheDocument();
  });

  it("shows the empty-date state and live zero-result announcement without rendering a stale table",()=>{
    renderHistory({selectedDate:"2026-07-25"});

    expect(screen.getByRole("button",{name:"Saturday, July 25, 2026"})).toHaveAttribute("aria-current","date");
    expect(screen.getByRole("status")).toHaveTextContent("No meal and workout history for this date.");
    expect(screen.getByText("Saturday, July 25, 2026: 0 results.")).toHaveAttribute("aria-live","polite");
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
    expect(screen.queryByText("Recovery breakfast")).not.toBeInTheDocument();
  });

  it("disables dates outside the dashboard available set and does not call selection for disabled dates",()=>{
    const onSelectDate=vi.fn();
    renderHistory({availableDates:new Set(["2026-07-20"]),onSelectDate});
    const sunday=screen.getByRole("button",{name:"Sunday, July 19, 2026"});
    const tuesday=screen.getByRole("button",{name:"Tuesday, July 21, 2026"});

    expect(sunday).toBeDisabled();
    expect(tuesday).toBeDisabled();
    expect(screen.getByRole("button",{name:"Previous week"})).toBeDisabled();
    expect(screen.getByRole("button",{name:"Next week"})).toBeDisabled();
    fireEvent.click(tuesday);
    expect(onSelectDate).not.toHaveBeenCalled();
  });

  it("keeps the local table region focusable and scrolls it with horizontal arrow keys",()=>{
    renderHistory();
    const tableRegion=screen.getByRole("region",{name:"Meal and workout history table for Monday, July 20, 2026"});

    tableRegion.focus();
    expect(document.activeElement).toBe(tableRegion);
    expect(tableRegion.scrollLeft).toBe(0);
    fireEvent.keyDown(tableRegion,{key:"ArrowRight"});
    expect(tableRegion.scrollLeft).toBe(48);
    fireEvent.keyDown(tableRegion,{key:"ArrowLeft"});
    expect(tableRegion.scrollLeft).toBe(0);
    fireEvent.keyDown(tableRegion,{key:"ArrowDown"});
    expect(tableRegion.scrollLeft).toBe(0);
  });

  it("routes enabled week controls across a year boundary when exact targets are available",()=>{
    const history:ReferenceHistoryData={
      selectedDate:"2026-12-31",
      availableDateRange:["2026-12-24","2027-01-07"],
      entries:[
        {id:"year-1",date:"2026-12-31",mealName:"Year close dinner",recipe:"Lentil stew",workoutCalories:-250,recipeCalories:510,price:7.25},
        {id:"year-2",date:"2027-01-07",mealName:"New year lunch",recipe:"Citrus grain bowl",workoutCalories:-310,recipeCalories:480,price:6.4}
      ]
    };
    const onSelectDate=vi.fn();
    renderHistory({
      history,
      selectedDate:"2026-12-31",
      availableDates:new Set(["2026-12-24","2026-12-31","2027-01-01","2027-01-07"]),
      onSelectDate
    });

    expect(screen.getByText("12 / 2026")).toBeInTheDocument();
    expect(screen.getByRole("button",{name:"Sunday, December 27, 2026"})).toBeDisabled();
    expect(screen.getByRole("button",{name:"Friday, January 1, 2027"})).toBeEnabled();
    fireEvent.click(screen.getByRole("button",{name:"Previous week"}));
    fireEvent.click(screen.getByRole("button",{name:"Next week"}));

    expect(onSelectDate).toHaveBeenNthCalledWith(1,"2026-12-24");
    expect(onSelectDate).toHaveBeenNthCalledWith(2,"2027-01-07");
  });
});
