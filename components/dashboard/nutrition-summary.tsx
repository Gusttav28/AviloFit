import {ArrowUpRight,ChevronDown,Flame} from "lucide-react";
import type {ReferenceSummary} from "@/features/dashboard/model";

export function NutritionSummary({summary}:{summary:ReferenceSummary}) {
  return <section className="summary-section" aria-labelledby="summary-heading">
    <div className="summary-heading-row">
      <div>
        <h2 id="summary-heading">Summary</h2>
        <p>Track your performance.</p>
      </div>
      <button className="weekly-chip" type="button" aria-label="Weekly summary selector">Weekly <ChevronDown size={12} aria-hidden="true" /></button>
    </div>
    <div className="summary-card">
      <div className="summary-stats" aria-label="Nutrition weekly stats">
        <div className="mini-stat">
          <span className="mini-icon"><Flame size={13} aria-hidden="true" /></span>
          <span>Calorie Intake</span>
          <strong>{summary.calorieIntake}</strong>
        </div>
        <div className="mini-stat">
          <span>Active Burn</span>
          <strong>{summary.activeBurn}</strong>
          <span className="stat-jump"><ArrowUpRight size={13} aria-hidden="true" /></span>
        </div>
      </div>
      <div className="macro-bars" aria-label="Seven day macro bars">
        {summary.bars.map((bar,index)=>
          <div className="macro-day" key={`${bar.day}-${index}`}>
            <div className="macro-stack" role="img" aria-label={`${bar.day} macro split`}>
              <span className="macro-segment carbs" style={{height:`${bar.carbs}%`}} />
              <span className="macro-segment fat" style={{height:`${bar.fat}%`}} />
              <span className="macro-segment protein" style={{height:`${bar.protein}%`}} />
            </div>
            <span>{bar.day}</span>
          </div>
        )}
      </div>
      <div className="macro-legend" aria-label="Macro legend">
        {summary.legend.map(row=>
          <div className="legend-row" key={row.label}>
            <span className={`legend-dot ${row.color}`} aria-hidden="true" />
            <span>{row.label}</span>
            <strong>{row.value}</strong>
            <em>{row.goal}</em>
          </div>
        )}
      </div>
    </div>
  </section>;
}
