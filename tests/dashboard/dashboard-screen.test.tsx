import {fireEvent,render,screen} from "@testing-library/react";
import {describe,expect,it} from "vitest";
import {DashboardScreen} from "@/components/dashboard/dashboard-screen";
import {fixtureDashboardProvider,fixtureWithSectionState} from "@/features/dashboard/fixture-dashboard-provider";

describe("dashboard",()=>{
  it("renders the reference first viewport and removes old greeting copy",async()=>{
    const model=await fixtureDashboardProvider.getDashboard();
    render(<DashboardScreen model={model} />);

    expect(screen.getByRole("heading",{name:"Keep it up, Uzui!"})).toBeInTheDocument();
    expect(screen.getByText("Track your nutrition, activity, and goals")).toBeInTheDocument();
    expect(screen.getByRole("button",{name:/Filters/})).toBeInTheDocument();
    expect(screen.getByRole("button",{name:/Reports/})).toBeInTheDocument();
    expect(screen.queryByText(/Today.s fuel thread/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/next meal easy/i)).not.toBeInTheDocument();
  });

  it("renders summary, activity, and lower progress content from synthetic fixtures",async()=>{
    const model=await fixtureDashboardProvider.getDashboard();
    const {container}=render(<DashboardScreen model={model} />);

    expect(screen.getByRole("heading",{name:"Summary"})).toBeInTheDocument();
    expect(screen.getByRole("button",{name:"Weekly summary selector"})).toHaveTextContent("Weekly");
    expect(screen.getByText("Calorie Intake")).toBeInTheDocument();
    expect(screen.getByText("2,135,00")).toBeInTheDocument();
    expect(screen.getByText("Active Burn")).toBeInTheDocument();
    expect(screen.getByText("873,00")).toBeInTheDocument();
    expect(container.querySelectorAll(".macro-stack")).toHaveLength(7);
    for(const text of ["Carbohydrates (188gr)","Fat (62gr)","Protein (110gr)","43%","32%","25%"])expect(screen.getByText(text)).toBeInTheDocument();

    for(const text of ["Hydration","Steps","Sleep","Active Calories","Distance","Heart Rate","3.2 L","12,560","7h 20m","450 kcal","8.4 km","72 bpm"])expect(screen.getByText(text)).toBeInTheDocument();
    expect(container.querySelector(".activity-metric.dark")).toHaveTextContent("Sleep");

    expect(screen.getByText("Fat Loss Progress")).toBeInTheDocument();
    expect(screen.getByText("4.2 kg")).toBeInTheDocument();
    expect(screen.getByText("Protein Goal")).toBeInTheDocument();
    expect(screen.getByText("145 g/day")).toBeInTheDocument();
  });

  it("places the Ask Avilo input directly after preserved progress goals",async()=>{
    const model=await fixtureDashboardProvider.getDashboard();
    const {container}=render(<DashboardScreen model={model} />);
    const referenceGrid=container.querySelector(".reference-grid");
    const leftColumn=container.querySelector(".dashboard-left-column");
    const summaryColumn=container.querySelector(".summary-column");
    const rightColumn=container.querySelector(".dashboard-right-column");
    const activityColumn=container.querySelector(".activity-column");
    const progressRegion=screen.getByRole("region",{name:"Progress goals"});
    const askInput=screen.getByRole("region",{name:"Ask anything to Avilo AI"});
    const searchbox=screen.getByRole("searchbox",{name:"Ask anything to Avilo AI"});
    const label=screen.getByText("Ask anything to Avilo AI");

    expect(referenceGrid?.children).toHaveLength(2);
    expect(referenceGrid?.children[0]).toBe(leftColumn);
    expect(referenceGrid?.children[1]).toBe(rightColumn);
    expect(rightColumn?.children[0]).toBe(activityColumn);
    expect(rightColumn?.children[1]).toBe(screen.getByRole("region",{name:"Meal Recipes & Workout"}));
    expect(leftColumn?.children[0]).toBe(summaryColumn);
    expect(leftColumn?.children[1]).toBe(progressRegion);
    expect(leftColumn?.children[2]).toBe(askInput);
    expect(summaryColumn).not.toContainElement(progressRegion);
    expect(summaryColumn).not.toContainElement(askInput);
    expect(progressRegion).not.toContainElement(askInput);
    expect(askInput.querySelector(".progress-card")).toBeNull();
    expect(screen.getAllByText("Ask anything to Avilo AI")).toHaveLength(1);
    expect(label.compareDocumentPosition(searchbox)&Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(searchbox).toBeInTheDocument();
    expect(screen.getByRole("button",{name:"Clear Ask Avilo input"})).toBeInTheDocument();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(screen.getAllByRole("region",{name:"Progress goals"})).toHaveLength(1);
    expect(progressRegion.querySelectorAll(".progress-card")).toHaveLength(2);
    for(const text of [
      "Fat Loss Progress","Progress toward your body fat goal.","4.2 kg","53%",
      "Protein Goal","Daily protein intake progress.","145 g/day","81%"
    ])expect(screen.getAllByText(text)).toHaveLength(1);
    expect(progressRegion.querySelectorAll(".trend-icon.down")).toHaveLength(1);
    expect(progressRegion.querySelectorAll(".trend-icon.up")).toHaveLength(1);
  });

  it("keeps Ask Avilo typing, Escape, Enter, and clear behavior local",async()=>{
    const model=await fixtureDashboardProvider.getDashboard();
    render(<DashboardScreen model={model} />);
    const input=screen.getByRole("searchbox",{name:"Ask anything to Avilo AI"}) as HTMLInputElement;
    const shell=input.closest(".ask-avilo-gooey-shell");
    const clear=screen.getByRole("button",{name:"Clear Ask Avilo input"});

    expect(shell).toHaveAttribute("data-state","collapsed");
    fireEvent.focus(input);
    expect(shell).toHaveAttribute("data-state","expanded");
    fireEvent.change(input,{target:{value:"What can I cook after training?"}});
    expect(input.value).toBe("What can I cook after training?");
    expect(shell).toHaveAttribute("data-state","expanded");
    fireEvent.keyDown(input,{key:"Enter"});
    expect(input.value).toBe("What can I cook after training?");
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();

    fireEvent.keyDown(input,{key:"Escape"});
    expect(input.value).toBe("");
    expect(shell).toHaveAttribute("data-state","collapsed");
    fireEvent.focus(input);
    fireEvent.change(input,{target:{value:"Protein snack"}});
    fireEvent.click(clear);
    expect(input.value).toBe("");
    expect(shell).toHaveAttribute("data-state","collapsed");
    expect(screen.getByText("Ask anything to Avilo AI")).toBeVisible();
  });

  it("renders and recovers every independent section state still used by the redesigned viewport",()=>{
    for(const name of ["nutrition","goal","activity","history"] as const){
      for(const status of ["loading","empty","error"] as const){
        const {unmount}=render(<DashboardScreen model={fixtureWithSectionState(name,status)} />);
        const state=screen.getByRole("region",{name:`${name} state`});
        expect(state).toHaveTextContent(status==="loading"?"is loading":status==="empty"?"no available data":"could not load");
        if(status==="error"){
          fireEvent.click(screen.getByRole("button",{name:"Retry section"}));
          expect(screen.queryByRole("region",{name:`${name} state`})).not.toBeInTheDocument();
        }
        unmount();
      }
    }
  });

  it("renders history after Activity and retries it without changing sibling states",()=>{
    const model=fixtureWithSectionState("history","error");
    model.sectionStates.activity="loading";
    const {container}=render(<DashboardScreen model={model} />);
    const rightColumn=container.querySelector(".dashboard-right-column")!;
    expect(rightColumn.children[0]).toHaveClass("activity-column");
    expect(rightColumn.children[1]).toHaveAccessibleName("history state");
    expect(screen.getByText("activity is loading.")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button",{name:"Retry section"}));
    expect(screen.getByRole("heading",{name:"Meal Recipes & Workout"})).toBeInTheDocument();
    expect(screen.getByText("Avilo Fit Recipes History")).toBeInTheDocument();
    expect(screen.getByText("activity is loading.")).toBeInTheDocument();
    expect(screen.getAllByRole("region",{name:"Meal Recipes & Workout"})).toHaveLength(1);
  });
});
