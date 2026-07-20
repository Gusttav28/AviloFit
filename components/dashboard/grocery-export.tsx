"use client";
import {useState} from "react";
import {Button} from "@/components/ui/button";
import {Dialog,DialogClose,DialogContent,DialogTrigger} from "@/components/ui/dialog";
import type {GroceryItem} from "@/features/dashboard/model";
import {Download,X} from "lucide-react";
import {formatCurrency} from "@/features/dashboard/format";

export const buildGroceryExportText=(items:GroceryItem[],locale:string,currency:string)=>[
  "Avilo Fit grocery list",
  ...items.map(i=>`${i.name} — ${i.quantity??"quantity unavailable"} ${i.unit??""} — ${i.meals.join(", ")} — ${i.estimatedCost!=null?formatCurrency(i.estimatedCost,locale,currency):"estimate unavailable"}`),
  "Costs are estimates. No retailer integration is connected."
].join("\n");

export function GroceryExport({items,locale,currency}:{items:GroceryItem[];locale:string;currency:string}){
  const [message,setMessage]=useState("");
  const download=()=>{const text=buildGroceryExportText(items,locale,currency);const url=URL.createObjectURL(new Blob([text],{type:"text/plain"}));const a=document.createElement("a");a.href=url;a.download="avilo-grocery-list.txt";a.click();URL.revokeObjectURL(url);setMessage("Grocery list downloaded locally.")};
  return <Dialog><DialogTrigger asChild><Button><Download size={15}/> Export grocery list</Button></DialogTrigger><DialogContent title="Missing groceries"><div className="section-head"><p className="muted">Only ingredients not confirmed in your pantry</p><DialogClose asChild><Button aria-label="Close grocery list"><X size={16}/></Button></DialogClose></div><ul className="grocery-list">{items.map(i=><li key={i.name}><span><strong>{i.name}</strong><br/><span className="meta">For {i.meals.join(", ")}</span></span><span>{i.quantity??"Quantity unavailable"} {i.unit}<br/><span className="meta">{i.estimatedCost!=null?formatCurrency(i.estimatedCost,locale,currency):"Estimate unavailable"}</span></span></li>)}</ul><p className="disclosure">Costs are estimates. This creates a provider-neutral file only; no supermarket or retailer is connected.</p><Button className="primary" onClick={download}>Download list</Button><span role="status">{message}</span></DialogContent></Dialog>
}
