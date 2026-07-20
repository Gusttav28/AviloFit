"use client";
import { useMemo, useState } from "react";
import { Dialog,DialogClose,DialogContent,DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CalendarDays,ChevronLeft,ChevronRight,X } from "lucide-react";
import type { Day } from "@/features/dashboard/model";
import { formatDate } from "@/features/dashboard/format";

export function CalendarDialog({days,selected,onSelect,locale,timeZone}:{days:Day[];selected:string;onSelect:(date:string)=>void;locale:string;timeZone:string}){
  const months=useMemo(()=>[...new Set(days.map(day=>day.date.slice(0,7)))],[days]);
  const [month,setMonth]=useState(selected.slice(0,7));
  const index=Math.max(0,months.indexOf(month));
  const visible=days.filter(day=>day.date.startsWith(months[index]));
  return <Dialog><DialogTrigger asChild><Button><CalendarDays size={16}/> Open calendar</Button></DialogTrigger><DialogContent title="Choose a day"><div className="section-head"><div><p className="muted">Available plan and recorded days</p><div className="month-controls"><Button aria-label="Previous available month" disabled={index<=0} onClick={()=>setMonth(months[index-1])}><ChevronLeft size={16}/></Button><strong>{formatDate(`${months[index]}-01`,locale,{month:"long",year:"numeric"},timeZone)}</strong><Button aria-label="Next available month" disabled={index>=months.length-1} onClick={()=>setMonth(months[index+1])}><ChevronRight size={16}/></Button></div></div><DialogClose asChild><Button aria-label="Close calendar"><X size={16}/></Button></DialogClose></div><div className="activity-grid">{visible.map(day=><DialogClose asChild key={day.date}><button className={`day-card ${selected===day.date?"selected":""} ${day.isToday?"today":""}`} aria-pressed={selected===day.date} aria-label={`${formatDate(day.date,locale,undefined,timeZone)}${day.isToday?"; Today":""}${selected===day.date?"; Selected":""}`} onClick={()=>onSelect(day.date)}><span className="day-dot">{new Date(`${day.date}T12:00:00Z`).getUTCDate()}</span><strong>{formatDate(day.date,locale,undefined,timeZone)}</strong>{day.isToday&&<span className="day-signal">Today</span>}<span className="day-signal">{day.planState}</span></button></DialogClose>)}</div></DialogContent></Dialog>;
}
