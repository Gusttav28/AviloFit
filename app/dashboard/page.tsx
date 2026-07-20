import {DashboardScreen} from "@/components/dashboard/dashboard-screen";import {fixtureDashboardProvider} from "@/features/dashboard/fixture-dashboard-provider";
export default async function DashboardPage(){const model=await fixtureDashboardProvider.getDashboard();return <DashboardScreen model={model}/>}
