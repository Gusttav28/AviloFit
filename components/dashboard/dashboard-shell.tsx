import type {ReactNode} from "react";
import {Bell,UserRound} from "lucide-react";
import {AdaptiveNavigation} from "./adaptive-navigation";
import {ContextualUtilities} from "./contextual-utilities";

export function DashboardShell({children}:{children:ReactNode}) {
  return <div className="dashboard-frame">
    <header className="dashboard-topbar" aria-label="Dashboard controls">
      <AdaptiveNavigation />
      <div className="topbar-actions" aria-label="Account actions">
        <button className="icon-button" type="button" aria-label="Notifications"><Bell size={16} /></button>
        <button className="icon-button" type="button" aria-label="Profile"><UserRound size={16} /></button>
      </div>
    </header>
    <ContextualUtilities />
    {children}
  </div>;
}
