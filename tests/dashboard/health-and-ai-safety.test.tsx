import {fireEvent,render,screen} from "@testing-library/react";
import {describe,expect,it,vi} from "vitest";
import {AskAvilo} from "@/components/dashboard/ask-avilo";
import {ActivitySummary} from "@/components/dashboard/activity-summary";
import {GoalProgress} from "@/components/dashboard/goal-progress";
import {NutritionSummary} from "@/components/dashboard/nutrition-summary";
import {MealWorkoutHistory} from "@/components/dashboard/meal-workout-history";
import {fixtureAskAviloProvider,fixtureDashboardProvider,fixtureReferenceDashboard} from "@/features/dashboard/fixture-dashboard-provider";
import {selectDay} from "@/features/dashboard/selectors";

describe("health and AI safety",()=>{
  it("labels assistance, prevents empty submit and responds from sanitized selected-day context",async()=>{
    const model=await fixtureDashboardProvider.getDashboard(),day=selectDay(model,model.selectedDate);
    render(<AskAvilo date={model.selectedDate} recommendation={day.meals[0].name} contexts={model.contextsByDate[model.selectedDate]} provider={fixtureAskAviloProvider}/>);
    expect(screen.getByText(/not diagnosis or professional care/)).toBeInTheDocument();
    expect(screen.getByRole("button",{name:"Ask"})).toBeDisabled();
    fireEvent.click(screen.getByText("What can I cook now?"));
    fireEvent.click(screen.getByRole("button",{name:"Ask"}));
    expect(await screen.findByText(/Herby chickpea bowl fits \$18\.00 daily budget/)).toBeInTheDocument();
  });

  it("renders synthetic reference activity cards without external provenance",()=>{
    const {container}=render(<ActivitySummary cards={fixtureReferenceDashboard.activityCards}/>);
    for(const text of ["Hydration","Steps","Sleep","Active Calories","Distance","Heart Rate"])expect(screen.getByText(text)).toBeInTheDocument();
    expect(screen.getByText(/deterministic demo activity data/i)).toBeInTheDocument();
    expect(container).not.toHaveTextContent("Connected health");
  });

  it("renders synthetic reference nutrition values without health-source provenance",()=>{
    render(<NutritionSummary summary={fixtureReferenceDashboard.summary}/>);
    expect(screen.getByText("Calorie Intake")).toBeInTheDocument();
    expect(screen.getByText("2,135,00")).toBeInTheDocument();
    expect(screen.getByText("Carbohydrates (188gr)")).toBeInTheDocument();
    expect(screen.queryByText(/Connected health|Nutritionist plan|real health/i)).not.toBeInTheDocument();
  });

  it("renders deterministic progress goals without persistence or outcome guarantees",()=>{
    render(<GoalProgress cards={fixtureReferenceDashboard.progressCards}/>);
    expect(screen.getByText("Fat Loss Progress")).toBeInTheDocument();
    expect(screen.getByText("Protein Goal")).toBeInTheDocument();
    expect(screen.getByText("53%")).toBeInTheDocument();
    expect(screen.getByText("81%")).toBeInTheDocument();
  });

  it("renders local synthetic history without health, AI, billing, or purchase provenance",()=>{
    const {container}=render(<MealWorkoutHistory history={fixtureReferenceDashboard.history} locale="en-US" currency="USD" timeZone="America/Costa_Rica"/>);
    expect(screen.getByText(/deterministic demo data/i)).toBeInTheDocument();
    expect(container).toHaveTextContent("Workout -450 kcal");
    expect(container).toHaveTextContent("Recipe +420 kcal");
    expect(container).not.toHaveTextContent(/Connected health|medical|diagnosis|offset|charge|billing|purchase|AI/i);
  });

  it("surfaces an AI retry on provider error",async()=>{
    const model=await fixtureDashboardProvider.getDashboard();
    render(<AskAvilo date={model.selectedDate} recommendation="Herby chickpea bowl" contexts={model.contextsByDate[model.selectedDate]} provider={{ask:vi.fn().mockRejectedValue(new Error("fixture"))}}/>);
    fireEvent.click(screen.getByText("What can I cook now?"));
    fireEvent.click(screen.getByRole("button",{name:"Ask"}));
    expect(await screen.findByRole("alert")).toHaveTextContent("Retry");
  });
});
