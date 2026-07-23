import {ActivityScreen} from "@/components/activity/activity-screen"; import {fixtureActivityProvider} from "@/features/activity/activity-provider";
export default async function ActivityPage(){return <ActivityScreen model={await fixtureActivityProvider.getActivity()}/>}
