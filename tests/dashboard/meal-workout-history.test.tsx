import {fireEvent,render,screen,within} from "@testing-library/react";
import {describe,expect,it} from "vitest";
import {MealWorkoutHistory} from "@/components/dashboard/meal-workout-history";
import {fixtureReferenceDashboard} from "@/features/dashboard/fixture-dashboard-provider";
import type {ReferenceHistoryData} from "@/features/dashboard/model";

const props={history:fixtureReferenceDashboard.history,locale:"en-US",currency:"USD",timeZone:"America/Costa_Rica"};

describe("meal and workout history",()=>{
  it("renders the exact initial selector, rows, signed values, prices, and semantic table",()=>{
    const {container}=render(<MealWorkoutHistory {...props}/>);

    expect(screen.getByRole("heading",{name:"Meal Recipes & Workout"})).toBeInTheDocument();
    expect(screen.getByText("Avilo Fit Recipes History")).toBeInTheDocument();
    expect(screen.getByText("07 / 2026")).toBeInTheDocument();
    expect(screen.getByRole("button",{name:"Monday, July 13, 2026"})).toHaveAttribute("aria-pressed","true");
    expect(screen.getByRole("button",{name:"Monday, July 13, 2026"})).toHaveAttribute("aria-current","date");
    expect(container.querySelectorAll(".history-date-button")).toHaveLength(7);
    expect([...container.querySelectorAll(".history-date-button>span")].map(node=>node.textContent)).toEqual(["S","M","T","W","T","F","S"]);

    const table=screen.getByRole("table",{name:"Meal and workout history for Monday, July 13, 2026"});
    const headers=within(table).getAllByRole("columnheader");
    expect(headers.map(header=>header.textContent)).toEqual(["Meal Name","Recipe","Value","Price"]);
    expect(headers.every(header=>header.getAttribute("scope")==="col")).toBe(true);
    expect(within(table).getAllByRole("row")).toHaveLength(3);
    expect(within(table).getAllByRole("cell").map(cell=>cell.textContent)).toEqual([
      "Post-workout lunch","Herby chickpea bowl","Workout -450 kcalRecipe +420 kcal","$6.80",
      "Afternoon recovery","Cocoa banana bites","Workout -210 kcalRecipe +420 kcal","$2.60"
    ]);
    expect(screen.queryByText(/Activity|Ref|Status|Purchase|Buy/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Rows and estimated prices are deterministic demo data/i)).toBeInTheDocument();
  });

  it("filters populated and empty dates while retaining focus and announcing results",()=>{
    render(<MealWorkoutHistory {...props}/>);
    const tuesday=screen.getByRole("button",{name:"Tuesday, July 14, 2026"});
    tuesday.focus();
    fireEvent.click(tuesday);
    expect(tuesday).toHaveFocus();
    expect(tuesday).toHaveAttribute("aria-current","date");
    expect(screen.getByText("Morning meal")).toBeInTheDocument();
    expect(screen.getByText("Apple overnight oats")).toBeInTheDocument();
    expect(screen.getByText("Workout -280 kcal")).toBeInTheDocument();
    expect(screen.getByText("$3.90")).toBeInTheDocument();
    expect(screen.getByText("Tuesday, July 14, 2026: 1 result.")).toHaveAttribute("aria-live","polite");

    const thursday=screen.getByRole("button",{name:"Thursday, July 16, 2026"});
    thursday.focus();
    fireEvent.click(thursday);
    expect(thursday).toHaveFocus();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("No meal and workout history for this date.");
    expect(screen.getByText("Thursday, July 16, 2026: 0 results.")).toBeInTheDocument();
  });

  it("moves exactly seven days in both directions and disables range boundaries",()=>{
    render(<MealWorkoutHistory {...props}/>);
    const previous=screen.getByRole("button",{name:"Previous week"});
    const next=screen.getByRole("button",{name:"Next week"});

    fireEvent.click(previous);
    expect(screen.getByRole("button",{name:"Monday, July 6, 2026"})).toHaveAttribute("aria-current","date");
    fireEvent.click(previous);
    expect(screen.getByRole("button",{name:"Monday, June 29, 2026"})).toHaveAttribute("aria-current","date");
    expect(screen.getByText("06 / 2026")).toBeInTheDocument();
    expect(previous).toBeDisabled();

    fireEvent.click(next);
    fireEvent.click(next);
    fireEvent.click(next);
    expect(screen.getByRole("button",{name:"Monday, July 20, 2026"})).toHaveAttribute("aria-current","date");
    expect(next).toBeDisabled();
  });

  it("keeps out-of-range visible dates disabled",()=>{
    const history:ReferenceHistoryData={...props.history,selectedDate:"2026-07-13",availableDateRange:["2026-07-13","2026-07-17"]};
    render(<MealWorkoutHistory {...props} history={history}/>);
    const sunday=screen.getByRole("button",{name:"Sunday, July 12, 2026"});
    expect(sunday).toBeDisabled();
    fireEvent.click(sunday);
    expect(screen.getByRole("button",{name:"Monday, July 13, 2026"})).toHaveAttribute("aria-current","date");
  });

  it("updates the numeric header across a year boundary with native button activation",()=>{
    const history:ReferenceHistoryData={selectedDate:"2026-12-28",availableDateRange:["2026-12-20","2027-01-16"],entries:[]};
    render(<MealWorkoutHistory {...props} history={history}/>);
    const next=screen.getByRole("button",{name:"Next week"});
    next.focus();
    fireEvent.keyDown(next,{key:"Enter"});
    fireEvent.click(next);
    expect(next).toHaveFocus();
    expect(screen.getByText("01 / 2027")).toBeInTheDocument();
    expect(screen.getByRole("button",{name:"Monday, January 4, 2027"})).toHaveAttribute("aria-current","date");
  });
});
