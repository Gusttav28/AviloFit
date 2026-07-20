import {CalendarDays,Heart,MapPin,Search,Share2} from "lucide-react";
import {Tooltip} from "@/components/ui/tooltip";

const utilities=[
  {label:"Search",icon:Search,active:true},
  {label:"Share",icon:Share2},
  {label:"Calendar",icon:CalendarDays},
  {label:"Favorites",icon:Heart},
  {label:"Location",icon:MapPin}
];

export function ContextualUtilities(){
  return <aside className="utility-rail" aria-label="Quick utilities">
    {utilities.map(({label,icon:Icon,active})=>
      <Tooltip key={label} label={label}>
        <button className={active?"rail-button active":"rail-button"} type="button" aria-label={label}>
          <Icon size={16} aria-hidden="true" />
        </button>
      </Tooltip>
    )}
  </aside>;
}
