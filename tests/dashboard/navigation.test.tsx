import {render,screen} from "@testing-library/react";
import {describe,expect,it} from "vitest";
import {AdaptiveNavigation} from "@/components/dashboard/adaptive-navigation";
import {ContextualUtilities} from "@/components/dashboard/contextual-utilities";
import {DashboardShell} from "@/components/dashboard/dashboard-shell";

describe("navigation",()=>{
  it("renders the reference pill navigation with named icon controls",()=>{
    render(<AdaptiveNavigation />);
    expect(screen.getByRole("link",{name:"Home"})).toHaveAttribute("aria-current","page");
    expect(screen.getByRole("link",{name:"Energy shortcut"})).toBeInTheDocument();
    expect(screen.getByRole("link",{name:"Overview shortcut"})).toBeInTheDocument();
  });

  it("names top-right and utility rail controls for keyboard access",()=>{
    render(<DashboardShell><main>Dashboard</main></DashboardShell>);
    for(const name of ["Notifications","Profile"])expect(screen.getByRole("button",{name})).toBeInTheDocument();
  });

  it("renders the floating utility rail actions with a search entry",()=>{
    render(<ContextualUtilities />);
    for(const name of ["Search","Share","Calendar","Favorites","Location"])expect(screen.getByRole("button",{name})).toBeInTheDocument();
  });

  it("keeps one accessible utility control set for responsive layouts",()=>{
    render(<DashboardShell><main>Dashboard</main></DashboardShell>);
    expect(screen.getByLabelText("Quick utilities")).toBeInTheDocument();
    for(const name of ["Search","Share","Calendar","Favorites","Location"]){
      expect(screen.getAllByRole("button",{name})).toHaveLength(1);
    }
  });
});
