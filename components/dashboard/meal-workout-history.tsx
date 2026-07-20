"use client";

import {useState} from "react";
import {ChevronLeft,ChevronRight} from "lucide-react";
import {Table} from "@/components/ui/table";
import {formatCurrency,formatDate,formatNumericMonthYear,formatSignedCalories} from "@/features/dashboard/format";
import type {ReferenceHistoryData} from "@/features/dashboard/model";

const weekdayInitials=["S","M","T","W","T","F","S"];

function parseDateOnly(date:string){
  const [year,month,day]=date.split("-").map(Number);
  return new Date(Date.UTC(year,month-1,day,12));
}

function toDateOnly(date:Date){
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth()+1).padStart(2,"0")}-${String(date.getUTCDate()).padStart(2,"0")}`;
}

function addDays(date:string,amount:number){
  const next=parseDateOnly(date);
  next.setUTCDate(next.getUTCDate()+amount);
  return toDateOnly(next);
}

function weekDates(selectedDate:string){
  const selected=parseDateOnly(selectedDate);
  const sunday=addDays(selectedDate,-selected.getUTCDay());
  return weekdayInitials.map((_,index)=>addDays(sunday,index));
}

export function MealWorkoutHistory({history,locale,currency,timeZone}:{history:ReferenceHistoryData;locale:string;currency:string;timeZone:string}){
  const [selectedDate,setSelectedDate]=useState(history.selectedDate);
  const dates=weekDates(selectedDate);
  const entries=history.entries.filter(entry=>entry.date===selectedDate);
  const selectedLabel=formatDate(selectedDate,locale,{weekday:"long",month:"long",day:"numeric",year:"numeric"},timeZone);
  const shift=(amount:number)=>setSelectedDate(current=>addDays(current,amount));
  const previousDate=addDays(selectedDate,-7);
  const nextDate=addDays(selectedDate,7);
  const inRange=(date:string)=>date>=history.availableDateRange[0]&&date<=history.availableDateRange[1];
  const countLabel=`${entries.length} ${entries.length===1?"result":"results"}`;

  return <section className="history-panel" aria-labelledby="meal-workout-history-title">
    <header className="history-heading">
      <h2 id="meal-workout-history-title">Meal Recipes &amp; Workout</h2>
      <p>Avilo Fit Recipes History</p>
    </header>

    <div className="history-period-row">
      <strong>{formatNumericMonthYear(selectedDate,locale,timeZone)}</strong>
      <div className="history-week-controls">
        <button className="icon-button" type="button" aria-label="Previous week" disabled={!inRange(previousDate)} onClick={()=>shift(-7)}>
          <ChevronLeft size={17} aria-hidden="true" />
        </button>
        <button className="icon-button" type="button" aria-label="Next week" disabled={!inRange(nextDate)} onClick={()=>shift(7)}>
          <ChevronRight size={17} aria-hidden="true" />
        </button>
      </div>
    </div>

    <div className="history-date-grid" aria-label="Select history date">
      {dates.map((date,index)=>{
        const selected=date===selectedDate;
        const enabled=inRange(date);
        const fullLabel=formatDate(date,locale,{weekday:"long",month:"long",day:"numeric",year:"numeric"},timeZone);
        return <button
          className="history-date-button"
          type="button"
          key={date}
          aria-label={fullLabel}
          aria-pressed={selected}
          aria-current={selected?"date":undefined}
          disabled={!enabled}
          onClick={()=>setSelectedDate(date)}
        >
          <span aria-hidden="true">{weekdayInitials[index]}</span>
          <strong aria-hidden="true">{new Intl.NumberFormat(locale).format(Number(date.slice(-2)))}</strong>
        </button>;
      })}
    </div>

    <p className="sr-only" aria-live="polite">{selectedLabel}: {countLabel}.</p>

    {entries.length===0?<p className="history-date-empty" role="status">No meal and workout history for this date.</p>:<div className="history-table-scroll" role="region" aria-label={`Meal and workout history table for ${selectedLabel}`} tabIndex={0} onKeyDown={event=>{
      if(event.key!=="ArrowLeft"&&event.key!=="ArrowRight")return;
      event.preventDefault();
      event.currentTarget.scrollLeft+=event.key==="ArrowRight"?48:-48;
    }}>
      <Table className="history-table">
        <caption className="sr-only">Meal and workout history for {selectedLabel}</caption>
        <thead><tr>{["Meal Name","Recipe","Value","Price"].map(column=><th scope="col" key={column}>{column}</th>)}</tr></thead>
        <tbody>{entries.map(entry=><tr key={entry.id}>
          <td>{entry.mealName}</td>
          <td>{entry.recipe}</td>
          <td className="history-value">
            <span>Workout {formatSignedCalories(entry.workoutCalories,locale)}</span>
            <span>Recipe {formatSignedCalories(entry.recipeCalories,locale)}</span>
          </td>
          <td className="history-price">{formatCurrency(entry.price,locale,currency)}</td>
        </tr>)}</tbody>
      </Table>
    </div>}

    <p className="disclosure">Rows and estimated prices are deterministic demo data.</p>
  </section>;
}
