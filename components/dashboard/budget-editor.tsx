"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover,PopoverContent,PopoverTrigger } from "@/components/ui/popover";
import { Pencil } from "lucide-react";

export function BudgetEditor({amount,cadence,onSave,formatted}:{amount:number;cadence:"meal"|"day"|"week";onSave:(a:number,c:"meal"|"day"|"week")=>void;formatted:string}){
  const [open,setOpen]=useState(false);
  const [value,setValue]=useState(String(amount));
  const [period,setPeriod]=useState(cadence);
  const [error,setError]=useState("");
  const reset=()=>{setValue(String(amount));setPeriod(cadence);setError("")};
  return <div className="budget"><div><span className="meta">Demo budget · per {cadence}</span><br/><strong>{formatted}</strong></div><Popover open={open} onOpenChange={next=>{setOpen(next);if(next)reset()}}><PopoverTrigger asChild><Button aria-label="Edit budget"><Pencil size={15}/></Button></PopoverTrigger><PopoverContent><form className="budget-form" onSubmit={event=>{event.preventDefault();const parsed=Number(value);if(!Number.isFinite(parsed)||parsed<0){setError("Enter a non-negative amount.");return}setError("");onSave(parsed,period);setOpen(false)}}><div><Label htmlFor="budget">Amount</Label><Input id="budget" inputMode="decimal" value={value} onChange={event=>setValue(event.target.value)} aria-describedby={error?"budget-error":"budget-note"}/>{error&&<div id="budget-error" className="error">{error}</div>}</div><div><Label htmlFor="cadence">Cadence</Label><select id="cadence" className="input" value={period} onChange={event=>setPeriod(event.target.value as typeof period)}><option value="meal">Meal</option><option value="day">Day</option><option value="week">Week</option></select></div><p id="budget-note" className="disclosure">Demo only. Changes stay in this tab and reset on reload.</p><div className="form-actions"><Button type="button" onClick={()=>{reset();setOpen(false)}}>Cancel</Button><Button className="primary" type="submit">Save budget</Button></div></form></PopoverContent></Popover></div>;
}
