import type {AskAviloRequest,DashboardViewModel} from "./model";
export interface DashboardProvider {getDashboard():Promise<DashboardViewModel>}
export interface AskAviloProvider {ask(request:AskAviloRequest):Promise<string>}
