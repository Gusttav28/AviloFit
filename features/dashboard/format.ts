export const formatDate=(date:string,locale:string,options:Intl.DateTimeFormatOptions={weekday:"short",month:"short",day:"numeric"},timeZone="UTC")=>new Intl.DateTimeFormat(locale,{...options,timeZone}).format(new Date(`${date}T12:00:00Z`));

const zonedWallTime=(date:string,time:string,timeZone:string)=>{
  const [year,month,day]=date.split("-").map(Number),[hour,minute]=time.split(":").map(Number);
  const desired=Date.UTC(year,month-1,day,hour,minute);
  const parts=(instant:number)=>Object.fromEntries(new Intl.DateTimeFormat("en-CA",{timeZone,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).formatToParts(new Date(instant)).filter(part=>part.type!=="literal").map(part=>[part.type,Number(part.value)]));
  let instant=desired;
  for(let attempt=0;attempt<2;attempt++){const shown=parts(instant);instant+=desired-Date.UTC(shown.year,shown.month-1,shown.day,shown.hour,shown.minute)}
  return new Date(instant);
};

export const formatTime=(date:string,time:string,locale:string,timeZone:string)=>new Intl.DateTimeFormat(locale,{hour:"numeric",minute:"2-digit",timeZone}).format(zonedWallTime(date,time,timeZone));
export const formatCurrency=(value:number,locale:string,currency:string)=>new Intl.NumberFormat(locale,{style:"currency",currency}).format(value);
export const formatNumber=(value:number,locale:string,unit?:string)=>`${new Intl.NumberFormat(locale,{maximumFractionDigits:1}).format(value)}${unit?` ${unit}`:""}`;
export const formatPercent=(value:number,locale:string)=>new Intl.NumberFormat(locale,{maximumFractionDigits:1,style:"percent"}).format(value/100);
export const formatCompactMetric=(value:number,locale:string,unit:string)=>`${new Intl.NumberFormat(locale,{maximumFractionDigits:value%1===0?0:1}).format(value)} ${unit}`;
export const formatNumericMonthYear=(date:string,locale:string,timeZone:string)=>{
  const parts=new Intl.DateTimeFormat(locale,{month:"2-digit",year:"numeric",timeZone}).formatToParts(new Date(`${date}T12:00:00Z`));
  const month=parts.find(part=>part.type==="month")?.value??"";
  const year=parts.find(part=>part.type==="year")?.value??"";
  return `${month} / ${year}`;
};
export const formatSignedCalories=(value:number,locale:string)=>`${new Intl.NumberFormat(locale,{signDisplay:"always",maximumFractionDigits:0}).format(value)} kcal`;
