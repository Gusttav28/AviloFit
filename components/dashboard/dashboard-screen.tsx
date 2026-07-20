"use client";
import {useState,type ReactNode} from "react";
import type {DashboardSectionName,DashboardSectionStatus,DashboardViewModel} from "@/features/dashboard/model";
import {DashboardShell} from "./dashboard-shell";
import {NutritionSummary} from "./nutrition-summary";
import {GoalProgress} from "./goal-progress";
import {ActivitySummary} from "./activity-summary";
import {MealWorkoutHistory} from "./meal-workout-history";
import {SectionState} from "./section-state";
import {AskAviloGooeyInput} from "./ask-avilo";
import {Download,SlidersHorizontal} from "lucide-react";

export function DashboardScreen({model}:{model:DashboardViewModel}) {
  const [states,setStates]=useState(model.sectionStates);
  const retry=(name:DashboardSectionName)=>setStates(current=>({...current,[name]:"ready"}));
  const section=(name:DashboardSectionName,content:ReactNode)=>
    states[name]==="ready"?content:<section className="reference-state surface" aria-label={`${name} state`}><SectionState state={states[name] as Exclude<DashboardSectionStatus,"ready">} name={name} onRetry={()=>retry(name)} /></section>;

  return <DashboardShell>
    <main id="main" className="reference-dashboard">
      <section className="hero-row" aria-labelledby="dashboard-greeting">
        <div>
          <h1 id="dashboard-greeting">Keep it up, Uzui!</h1>
          <p>Track your nutrition, activity, and goals</p>
        </div>
        <div className="hero-actions" aria-label="Dashboard actions">
          <button className="action-chip" type="button"><SlidersHorizontal size={14} aria-hidden="true" />Filters</button>
          <button className="action-chip" type="button"><Download size={14} aria-hidden="true" />Reports</button>
        </div>
      </section>

      <div className="reference-grid">
        <div className="dashboard-left-column">
          <div className="summary-column">
            {section("nutrition",<NutritionSummary summary={model.reference.summary} />)}
          </div>
          {section("goal",<GoalProgress cards={model.reference.progressCards} />)}
          <AskAviloGooeyInput />
        </div>
        <div className="dashboard-right-column">
          <div className="activity-column">
            {section("activity",<ActivitySummary cards={model.reference.activityCards} />)}
          </div>
          {section("history",<MealWorkoutHistory history={model.reference.history} locale={model.locale} currency={model.currency} timeZone={model.timeZone} />)}
        </div>
      </div>
    </main>
  </DashboardShell>;
}
