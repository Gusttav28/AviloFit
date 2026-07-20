import {Bolt,Home,Square} from "lucide-react";

const actions=[
  {label:"Home",icon:Home,active:true},
  {label:"Energy shortcut",icon:Bolt},
  {label:"Overview shortcut",icon:Square}
];

export function AdaptiveNavigation(){
  return <nav className="pill-nav" aria-label="Primary">
    {actions.map(({label,icon:Icon,active})=>
      <a key={label} href={active?"/dashboard":"#"} className={active?"pill-nav-item active":"pill-nav-item"} aria-current={active?"page":undefined} aria-label={label}>
        <Icon size={15} aria-hidden="true" />
        {active&&<span>Home</span>}
      </a>
    )}
  </nav>;
}
