"use client";
import {ChevronLeft,ChevronRight} from "lucide-react";
import {Button} from "@/components/ui/button";
import type {Day} from "@/features/dashboard/model";
import {formatDate} from "@/features/dashboard/format";
import {CalendarDialog} from "./calendar-dialog";

export function DayStrip({days,selected,onSelect,locale,timeZone}:{days:Day[];selected:string;onSelect:(date:string)=>void;locale:string;timeZone:string}){
  const index=days.findIndex(d=>d.date===selected);
  return <section className="surface day-section" aria-labelledby="day-heading">
    <div className="section-head"><div><span className="eyebrow">Daily rhythm</span><h2 id="day-heading">Your week at a glance</h2></div><CalendarDialog days={days} selected={selected} onSelect={onSelect} locale={locale} timeZone={timeZone}/></div>
    <div className="day-row"><Button aria-label="Previous day" disabled={index<=0} onClick={()=>onSelect(days[index-1].date)}><ChevronLeft size={18}/></Button>{days.map(day=><button key={day.date} className={`day-card ${selected===day.date?"selected":""} ${day.isToday?"today":""}`} aria-pressed={selected===day.date} aria-label={`${formatDate(day.date,locale,{weekday:"long",month:"long",day:"numeric"},timeZone)}${day.isToday?"; Today":""}; ${day.planState}; ${day.activitySignal??"activity unavailable"}; ${day.mealSignal??"no meal"}`} onClick={()=>onSelect(day.date)}><span className="day-dot">{new Date(`${day.date}T12:00:00Z`).getUTCDate()}</span><strong>{formatDate(day.date,locale,{weekday:"short"},timeZone)}</strong><span className="day-signal">{day.planState}</span><span className="day-signal">{day.activitySignal??"Activity unavailable"}</span><span className="day-signal">{day.mealSignal??"No meal planned"}</span></button>)}<Button aria-label="Next day" disabled={index>=days.length-1} onClick={()=>onSelect(days[index+1].date)}><ChevronRight size={18}/></Button></div>
  </section>
}
