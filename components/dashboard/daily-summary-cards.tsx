"use client";
import {CalendarDays} from "lucide-react";
import {useEffect,useRef,useState} from "react";
import type {Day,DailyDashboardSnapshot} from "@/features/dashboard/model";
import {formatDate} from "@/features/dashboard/format";

export function DailySummaryCards({days,summariesByDate,selectedDate,onSelect,locale,timeZone}:{days:Day[];summariesByDate:Record<string,DailyDashboardSnapshot>;selectedDate:string;onSelect:(date:string)=>void;locale:string;timeZone:string}){
  const refs=useRef<Record<string,HTMLButtonElement|null>>({});
  const mounted=useRef(false);
  const [announcement,setAnnouncement]=useState("");
  useEffect(()=>{if(!mounted.current){mounted.current=true;return}const card=refs.current[selectedDate];if(card&&typeof card.scrollIntoView==="function")card.scrollIntoView({block:"nearest",inline:"nearest"});setAnnouncement(`Dashboard updated for ${formatDate(selectedDate,locale,{weekday:"long",month:"long",day:"numeric",year:"numeric"},timeZone)}.`)},[selectedDate,locale,timeZone]);
  return <section className="daily-summary-section" aria-labelledby="daily-summary-heading">
    <h2 id="daily-summary-heading" className="sr-only">Daily dashboard summaries</h2>
    <div className="daily-summary-scroll">
      <div className="daily-summary-row">
        {days.map(day=>{const snapshot=summariesByDate[day.date];const selected=day.date===selectedDate;const fullDate=formatDate(day.date,locale,{weekday:"long",month:"long",day:"numeric",year:"numeric"},timeZone);const nutrition=snapshot?.preview.nutrition??"Nutrition unavailable";const activity=snapshot?.preview.activity??"Activity unavailable";return <button key={day.date} ref={node=>{refs.current[day.date]=node}} className="daily-summary-card" type="button" aria-pressed={selected} aria-current={selected?"date":undefined} aria-label={`${fullDate}. ${nutrition}. ${activity}.${selected?" Selected":""}`} onClick={()=>onSelect(day.date)}>
          <span className="daily-summary-marker"><CalendarDays size={14} aria-hidden="true" /><strong>{new Intl.NumberFormat(locale).format(Number(day.date.slice(-2)))}</strong></span>
          <span className="daily-summary-weekday">{formatDate(day.date,locale,{weekday:"short"},timeZone)}</span>
          <span className="daily-summary-preview">{nutrition}</span><span className="daily-summary-preview">{activity}</span>
        </button>})}
      </div>
    </div>
    <p className="sr-only" aria-live="polite">{announcement}</p>
  </section>;
}
