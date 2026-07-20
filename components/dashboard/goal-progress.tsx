import {TrendingDown,TrendingUp} from "lucide-react";
import type {ReferenceProgressCard} from "@/features/dashboard/model";

export function GoalProgress({cards}:{cards:ReferenceProgressCard[]}) {
  return <section className="progress-row" aria-label="Progress goals">
    {cards.map(card=>{
      const Icon=card.trend==="up"?TrendingUp:TrendingDown;
      return <article className="progress-card" key={card.label}>
        <div className="progress-title-row">
          <h2>{card.label}</h2>
          <Icon className={card.trend==="up"?"trend-icon up":"trend-icon down"} size={16} aria-hidden="true" />
        </div>
        <p>{card.description}</p>
        <strong>{card.value}</strong>
        <span>{card.percent}</span>
      </article>;
    })}
  </section>;
}
