"use client";
import { FormEvent,KeyboardEvent,useEffect,useId,useState } from "react";
import type { ContextChip } from "@/features/dashboard/model";
import type { AskAviloProvider } from "@/features/dashboard/dashboard-provider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover,PopoverContent,PopoverTrigger } from "@/components/ui/popover";
import { Search,Sparkles,X } from "lucide-react";

const prompts=["What can I cook now?","What do I still need to buy?","How should I prep dinner?","Swap my afternoon snack"];

export function AskAviloGooeyInput(){
  const inputId=useId();
  const [value,setValue]=useState("");
  const [open,setOpen]=useState(false);
  const state=open||value?"expanded":"collapsed";
  const collapseIfEmpty=()=>setOpen(current=>value?current:false);
  const handleKeyDown=(event:KeyboardEvent<HTMLInputElement>)=>{
    if(event.key==="Enter")event.preventDefault();
    if(event.key==="Escape"){
      event.preventDefault();
      setValue("");
      setOpen(false);
    }
  };
  const clear=()=>{
    setValue("");
    setOpen(false);
  };

  return <section className="ask-avilo-gooey" aria-labelledby={`${inputId}-label`} onBlur={event=>{
    if(!event.currentTarget.contains(event.relatedTarget))collapseIfEmpty();
  }}>
    <label id={`${inputId}-label`} className="ask-avilo-gooey-label" htmlFor={inputId}>Ask anything to Avilo AI</label>
    <div className="ask-avilo-gooey-shell" data-state={state}>
      <svg className="ask-avilo-gooey-filter" width="0" height="0" aria-hidden="true" focusable="false">
        <filter id="ask-avilo-goo" colorInterpolationFilters="sRGB">
          <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="blur" />
          <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8" result="goo" />
          <feBlend in="SourceGraphic" in2="goo" />
        </filter>
      </svg>
      <div className="ask-avilo-gooey-surface" aria-hidden="true">
        <span className="ask-avilo-gooey-body" />
        <span className="ask-avilo-gooey-node" />
      </div>
      <Search className="ask-avilo-gooey-icon" size={17} aria-hidden="true" />
      <input
        id={inputId}
        className="ask-avilo-gooey-input"
        type="search"
        enterKeyHint="search"
        autoComplete="off"
        placeholder="Type your question"
        value={value}
        onFocus={()=>setOpen(true)}
        onClick={()=>setOpen(true)}
        onChange={event=>{setValue(event.target.value);setOpen(true)}}
        onKeyDown={handleKeyDown}
      />
      <button type="button" className="ask-avilo-gooey-dismiss" aria-label="Clear Ask Avilo input" onClick={clear}>
        <X size={16} aria-hidden="true" />
      </button>
    </div>
  </section>;
}

export function AskAvilo({date,recommendation,contexts,provider}:{date:string;recommendation?:string;contexts:ContextChip[];provider:AskAviloProvider}){
  const [question,setQuestion]=useState("");
  const [response,setResponse]=useState("");
  const [status,setStatus]=useState<"idle"|"loading"|"error">("idle");
  useEffect(()=>{setResponse("");setStatus("idle")},[date,recommendation,contexts]);
  const ask=async(event?:FormEvent)=>{event?.preventDefault();if(!question.trim())return;setStatus("loading");try{setResponse(await provider.ask({question,date,recommendation,contexts}));setStatus("idle")}catch{setStatus("error")}};
  return <section className="surface ask" aria-labelledby="ask-heading">
    <div className="section-head"><div><span className="eyebrow ask-eyebrow">Cook · buy · prep · swap</span><h2 id="ask-heading"><Sparkles size={18} className="heading-icon"/>Ask Avilo</h2><p className="muted">Turn today’s context into one practical next step.</p></div></div>
    <form className="ask-form" onSubmit={ask}><Input aria-label="Ask Avilo a question" placeholder="What should I make after my workout?" value={question} onChange={event=>setQuestion(event.target.value)}/><Button type="submit" disabled={!question.trim()||status==="loading"}>{status==="loading"?"Thinking…":"Ask"}</Button></form>
    <div className="prompt-row">{prompts.map(prompt=><button type="button" className="prompt" key={prompt} onClick={()=>setQuestion(prompt)}>{prompt}</button>)}</div>
    <div className="chips" aria-label="Recommendation context">{contexts.map(context=><Popover key={context.kind}><PopoverTrigger asChild><button type="button" className="chip">{context.available?"✓":"○"} {context.label}</button></PopoverTrigger><PopoverContent><strong>{context.available?"Available context":"Missing or demo context"}</strong><p>{context.detail}</p></PopoverContent></Popover>)}</div>
    {response&&<div className="response" role="status">{response}</div>}
    {status==="error"&&<div className="response" role="alert">Ask Avilo could not respond. <button type="button" className="prompt" onClick={()=>ask()}>Retry</button></div>}
    <p className="disclosure ask-disclosure">Avilo offers general assistance, not diagnosis or professional care. For medical, allergy, or eating-disorder concerns, talk with a qualified professional.</p>
  </section>
}
