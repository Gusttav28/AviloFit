import {ArrowDown,ArrowUpRight,Droplet,Footprints,HeartPulse,MoveDiagonal,SlidersHorizontal,Flame,MapPin,Minus,Moon} from "lucide-react";
import type {ReferenceActivityCard} from "@/features/dashboard/model";

const iconByKind={
  hydration:Droplet,
  steps:Footprints,
  sleep:Moon,
  calories:Flame,
  distance:MapPin,
  heart:HeartPulse
};

function Sparkline({points,dark=false}:{points:number[];dark?:boolean}) {
  const width=120,height=44;
  const max=Math.max(...points),min=Math.min(...points),range=Math.max(1,max-min);
  const d=points.map((point,index)=>{
    const x=(index/(points.length-1))*width;
    const y=height-((point-min)/range)*height;
    return `${index===0?"M":"L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(" ");
  return <svg className="sparkline" viewBox={`0 0 ${width} ${height}`} aria-hidden="true" focusable="false">
    <path d={d} fill="none" stroke={dark?"#05883e":"#9ac9aa"} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>;
}

function Trend({card}:{card:ReferenceActivityCard}) {
  const Icon=card.trendDirection==="up"?ArrowUpRight:card.trendDirection==="down"?ArrowDown:Minus;
  return <span className={`trend ${card.trendDirection}`}><Icon size={12} aria-hidden="true" />{card.trend}</span>;
}

export function ActivitySummary({cards}:{cards:ReferenceActivityCard[]}) {
  const large=cards.filter(card=>card.size==="large");
  const compact=cards.filter(card=>card.size==="compact");
  return <section className="activity-section" aria-labelledby="activity-heading">
    <div className="activity-heading-row">
      <div>
        <h2 id="activity-heading">Activity</h2>
        <p>Track your activity.</p>
      </div>
      <div className="activity-actions" aria-label="Activity controls">
        <button className="icon-button" type="button" aria-label="Tune activity cards"><SlidersHorizontal size={15} /></button>
        <button className="icon-button" type="button" aria-label="Open activity details"><MoveDiagonal size={15} /></button>
      </div>
    </div>
    <div className="activity-large-grid">
      {large.map(card=>{
        const Icon=iconByKind[card.kind];
        const dark=card.kind==="sleep";
        return <article className={dark?"activity-metric large dark":"activity-metric large"} key={card.label}>
          <div className="metric-label"><Icon size={15} aria-hidden="true" /><span>{card.label}</span><Trend card={card} /></div>
          <strong>{card.value}</strong>
          {card.sparkline&&<Sparkline points={card.sparkline} dark={dark} />}
        </article>;
      })}
    </div>
    <div className="activity-compact-grid">
      {compact.map(card=>{
        const Icon=iconByKind[card.kind];
        return <article className="activity-metric compact" key={card.label}>
          <div className="metric-label"><Icon size={14} aria-hidden="true" /><span>{card.label}</span><Trend card={card} /></div>
          <strong>{card.value}</strong>
          <div className="metric-progress" role="progressbar" aria-label={`${card.label} progress`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={card.progress??50}><span style={{width:`${card.progress??50}%`}} /></div>
        </article>;
      })}
    </div>
    <p className="disclosure">Values are deterministic demo activity data, not medical findings.</p>
  </section>;
}
