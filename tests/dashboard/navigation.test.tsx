import {render,screen,within} from "@testing-library/react";
import {describe,expect,it} from "vitest";
import {ContextualUtilities} from "@/components/dashboard/contextual-utilities";
import {DashboardShell} from "@/components/dashboard/dashboard-shell";

describe("navigation",()=>{
  it("renders the AviloFit branded Jobgio-style sidebar without obsolete top bar actions",()=>{
    render(<DashboardShell><main>Dashboard</main></DashboardShell>);
    expect(screen.queryByRole("link",{name:"Home"})).not.toBeInTheDocument();
    expect(document.querySelector(".dashboard-action-cluster")).not.toBeInTheDocument();
    const sidebar=screen.getByRole("complementary",{name:"Dashboard sidebar"});
    expect(within(sidebar).getByLabelText("AviloFit")).toBeInTheDocument();
    expect(within(sidebar).queryByText("Jobgio")).not.toBeInTheDocument();
    for(const name of ["Jobs","Applications","Companies","Users","Categories","Reports"])expect(within(sidebar).queryByRole("button",{name})).not.toBeInTheDocument();
    expect(document.querySelector(".utility-rail")).not.toBeInTheDocument();
  });
  it("renders the primary dashboard sidebar actions, settings separation, and profile block",()=>{
    render(<ContextualUtilities />);
    const sidebar=screen.getByRole("complementary",{name:"Dashboard sidebar"});
    const nav=within(sidebar).getByRole("navigation",{name:"Dashboard sections"});
    expect(within(nav).getByRole("link",{name:"Dashboard"})).toHaveAttribute("href","/dashboard");
    expect(within(nav).getByRole("link",{name:"Activity"})).toHaveAttribute("href","/activity");
    expect(within(nav).getByRole("link",{name:"Nutrition"})).toHaveAttribute("href","/nutrition");
    for(const name of ["Meal Planner","Course Release","Progress","Statistics","Goals"])expect(within(nav).getByRole("button",{name})).toBeInTheDocument();
    expect(within(nav).getByRole("link",{name:"Dashboard"})).toHaveAttribute("aria-current","page");
    expect(within(nav).queryByRole("button",{name:"Settings"})).not.toBeInTheDocument();
    expect(within(sidebar).getByRole("button",{name:"Settings"})).toBeInTheDocument();
    expect(within(sidebar).getByLabelText("Demo profile")).toHaveTextContent("Alex Carter");
    expect(within(sidebar).getByLabelText("Demo profile")).toHaveTextContent("Pro Member");
    expect(document.querySelector(".avilo-sidebar-nav")?.querySelectorAll(".avilo-sidebar-item")).toHaveLength(8);
    expect(document.querySelector(".avilo-sidebar-settings")?.querySelectorAll(".avilo-sidebar-item")).toHaveLength(1);
    expect(document.querySelectorAll(".avilo-sidebar-item svg")).toHaveLength(9);
  });
});
