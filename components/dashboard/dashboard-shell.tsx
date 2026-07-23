import type {ReactNode} from "react";
import {ContextualUtilities, type DashboardSection} from "./contextual-utilities";

export function DashboardShell({children,currentSection="Dashboard"}:{children:ReactNode;currentSection?:DashboardSection}) {
  return <div className="dashboard-frame">
    <ContextualUtilities currentSection={currentSection} />
    {children}
  </div>;
}
