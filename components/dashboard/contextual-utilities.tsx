import {
  Activity,
  Apple,
  BarChart3,
  CalendarCheck,
  GraduationCap,
  LayoutDashboard,
  Settings,
  Target,
  TrendingUp
} from "lucide-react";
import Link from "next/link";

export type DashboardSection = "Dashboard" | "Activity" | "Nutrition" | "Meal Planner" | "Recipes";

const primaryItems=[
  {label:"Dashboard",icon:LayoutDashboard,href:"/dashboard"},
  {label:"Activity",icon:Activity,href:"/activity"},
  {label:"Nutrition",icon:Apple,href:"/nutrition"},
  {label:"Meal Planner",icon:CalendarCheck,href:"/meal-planner"},
  {label:"Recipes",icon:GraduationCap,href:"/recipes"},
  {label:"Progress",icon:TrendingUp},
  {label:"Statistics",icon:BarChart3},
  {label:"Goals",icon:Target}
];

const secondaryItems=[
  {label:"Settings",icon:Settings}
];

export function ContextualUtilities({currentSection="Dashboard"}:{currentSection?:DashboardSection}){
  return <aside className="avilo-sidebar" aria-label="Dashboard sidebar">
    <div className="avilo-sidebar-brand" aria-label="AviloFit">
      <span>Avilo</span><strong>Fit</strong>
    </div>
    <div className="avilo-sidebar-panel">
      <nav className="avilo-sidebar-nav" aria-label="Dashboard sections">
        {primaryItems.map(({label,icon:Icon,href})=>
          (() => { const active = label === currentSection; const content = <><span className="avilo-sidebar-icon" aria-hidden="true"><Icon size={15} /></span><span className="avilo-sidebar-label">{label}</span></>; return href ? <Link key={label} className={active?"avilo-sidebar-item active":"avilo-sidebar-item"} href={href} aria-label={label} aria-current={active?"page":undefined}>{content}</Link> : <button key={label} className="avilo-sidebar-item" type="button" aria-label={label}>{content}</button>; })()
        )}
      </nav>
    </div>
    <footer className="avilo-sidebar-footer">
      <div className="avilo-sidebar-settings" aria-label="Dashboard settings">
        {secondaryItems.map(({label,icon:Icon})=>
          <button key={label} className="avilo-sidebar-item" type="button" aria-label={label}>
            <span className="avilo-sidebar-icon" aria-hidden="true"><Icon size={15} /></span>
            <span className="avilo-sidebar-label">{label}</span>
          </button>
        )}
      </div>
      <div className="avilo-sidebar-profile" aria-label="Demo profile">
        <span className="avilo-sidebar-avatar" aria-hidden="true">AC</span>
        <span className="avilo-sidebar-status" aria-hidden="true" />
        <strong>Alex Carter</strong>
        <span>Pro Member</span>
      </div>
    </footer>
  </aside>;
}
