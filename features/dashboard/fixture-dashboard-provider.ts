import type { AskAviloProvider, DashboardProvider } from "./dashboard-provider";
import type { Activity, ContextChip, DashboardReferenceData, DashboardSectionName, DashboardSectionStatus, DashboardViewModel, Day, Goal, Meal, Nutrition } from "./model";

const meal = (id:string,name:string,occasion:string,time:string,cost:number,status:Meal["status"]="recommended"):Meal => ({
  id,name,occasion,time,cost,status,calories:occasion==="Dinner"?510:420,protein:32,carbs:48,fat:14,
  ingredients:[
    {name:"Avocado",quantity:1,unit:"item",inPantry:true,pantryState:"confirmed"},
    {name:"Chickpeas",quantity:1,unit:"can",inPantry:false,pantryState:"unknown",estimatedCost:1.8},
    {name:"Spinach",quantity:120,unit:"g",inPantry:false,pantryState:"assumed",estimatedCost:2.2}
  ]
});

const day = (date:string,kind:Day["kind"],meals:Meal[],activitySignal?:string):Day => ({
  date,kind,meals,activitySignal,mealSignal:meals[0]?.name,
  planState:kind==="future"?"Planned":kind==="empty"?"Open day":kind==="error"?"Unavailable":"On track",
  nutrition:{metrics:[
    {label:"Calories",value:1420,unit:"kcal",target:2100,provenance:"Demo target"},
    {label:"Protein",value:92,unit:"g",range:[105,135],provenance:"Your plan"},
    {label:"Carbohydrates",value:168,unit:"g",range:[190,240],provenance:"Your plan"},
    {label:"Fat",value:54,unit:"g",range:[50,70],provenance:"Your plan"}
  ]},
  goal:{kind:"nutrition-adherence",label:"Weekly consistency",measure:"5 of 7 days in range",window:"This week",trend:"moving toward range",target:"6 days",progress:72},
  activity:{access:kind==="future"?"unavailable":"connected",metrics:kind==="future"?[]:[
    {label:"Steps",value:7842,unit:"steps",source:"Connected health",freshness:"Updated 18 minutes ago",tone:"connected"},
    {label:"Recorded heart rate",value:78,unit:"bpm",source:"Connected health",freshness:"Latest recorded sample",tone:"connected"},
    {label:"Sleep",value:7.4,unit:"hours",source:"Connected health",freshness:"Updated this morning",tone:"connected"},
    {label:"Active energy",value:486,unit:"kcal",source:"Connected health",freshness:"Updated 18 minutes ago",tone:"movement"},
    {label:"Workouts",value:1,unit:"session",source:"Connected health",freshness:"Today",tone:"movement"}
  ]}
});

const contexts:ContextChip[]=[
  {kind:"budget",label:"$18.00 daily budget",detail:"Local demo budget for this day",available:true},
  {kind:"activity",label:"Today’s movement",detail:"Connected activity summary, updated 18 minutes ago",available:true},
  {kind:"nutrition-plan",label:"Your plan",detail:"Demo calorie and macro ranges",available:true},
  {kind:"preferences",label:"Food preferences",detail:"Plant-forward preference; demo context",available:true},
  {kind:"pantry",label:"Pantry",detail:"1 ingredient confirmed at home",available:true},
  {kind:"grocery",label:"Nearby groceries",detail:"No live store connection; demo estimates only",available:false}
];
const sectionStates:Record<DashboardSectionName,DashboardSectionStatus>={calendar:"ready",recommendations:"ready",nutrition:"ready",goal:"ready",activity:"ready",history:"ready",ai:"ready"};
export const fixtureReferenceDashboard:DashboardReferenceData={
  summary:{
    calorieIntake:"2,135,00",
    activeBurn:"873,00",
    bars:[
      {day:"S",carbs:34,fat:30,protein:24},
      {day:"M",carbs:30,fat:31,protein:26},
      {day:"T",carbs:37,fat:29,protein:25},
      {day:"W",carbs:31,fat:33,protein:22},
      {day:"T",carbs:36,fat:30,protein:25},
      {day:"F",carbs:34,fat:28,protein:28},
      {day:"S",carbs:30,fat:32,protein:24}
    ],
    legend:[
      {label:"Carbohydrates (188gr)",color:"green",value:"43%",share:"",goal:"50% Goal"},
      {label:"Fat (62gr)",color:"yellow",value:"32%",share:"",goal:"30% Goal"},
      {label:"Protein (110gr)",color:"red",value:"25%",share:"",goal:"20% Goal"}
    ]
  },
  activityCards:[
    {label:"Hydration",value:"3.2 L",trend:"+11.5%",trendDirection:"up",kind:"hydration",size:"large",sparkline:[28,38,42,36,31,34,45]},
    {label:"Steps",value:"12,560",trend:"+4.5%",trendDirection:"up",kind:"steps",size:"large",sparkline:[34,30,29,38,55,23,57]},
    {label:"Sleep",value:"7h 20m",trend:"-6.2%",trendDirection:"down",kind:"sleep",size:"large",sparkline:[27,34,38,35,28,18,36]},
    {label:"Active Calories",value:"450 kcal",trend:"-2.1%",trendDirection:"down",kind:"calories",size:"compact",progress:62},
    {label:"Distance",value:"8.4 km",trend:"+0.8km",trendDirection:"up",kind:"distance",size:"compact",progress:74},
    {label:"Heart Rate",value:"72 bpm",trend:"Stable",trendDirection:"stable",kind:"heart",size:"compact",progress:44,note:"Stable"}
  ],
  progressCards:[
    {label:"Fat Loss Progress",description:"Progress toward your body fat goal.",value:"4.2 kg",percent:"53%",trend:"down"},
    {label:"Protein Goal",description:"Daily protein intake progress.",value:"145 g/day",percent:"81%",trend:"up"}
  ],
  history:{
    selectedDate:"2026-07-13",
    availableDateRange:["2026-06-28","2026-07-25"],
    entries:[
      {id:"history-2026-07-12-1",date:"2026-07-12",mealName:"Recovery breakfast",recipe:"Garden egg toast",workoutCalories:-320,recipeCalories:420,price:4.7},
      {id:"history-2026-07-13-1",date:"2026-07-13",mealName:"Post-workout lunch",recipe:"Herby chickpea bowl",workoutCalories:-450,recipeCalories:420,price:6.8},
      {id:"history-2026-07-13-2",date:"2026-07-13",mealName:"Afternoon recovery",recipe:"Cocoa banana bites",workoutCalories:-210,recipeCalories:420,price:2.6},
      {id:"history-2026-07-14-1",date:"2026-07-14",mealName:"Morning meal",recipe:"Apple overnight oats",workoutCalories:-280,recipeCalories:420,price:3.9},
      {id:"history-2026-07-15-1",date:"2026-07-15",mealName:"Midday refuel",recipe:"Roasted veggie wrap",workoutCalories:-390,recipeCalories:420,price:5.7}
    ]
  }
};
const conflictMeal:Meal={...meal("m8","Peanut recovery toast","Pre-workout","10:30",4.2,"unavailable"),allergyConflict:"Contains a listed peanut allergy."};

export const fixtureMealMatrix:Meal[]=[
  meal("mx1","Breakfast fixture","Breakfast","07:00",3,"recommended"),meal("mx2","Snack fixture","Snack","10:00",2,"planned"),
  meal("mx3","Training fixture","Pre-workout","11:00",4,"unavailable"),meal("mx4","Lunch fixture","Lunch","13:00",6,"completed"),
  meal("mx5","Afternoon fixture","Afternoon snack","16:00",2,"skipped"),meal("mx6","Dinner fixture","Dinner","19:00",8,"planned")
];
export const fixtureGoals:Goal[]=["weight-loss","muscle-gain","maintenance","general-health","nutrition-adherence"].map((kind,index)=>({kind:kind as Goal["kind"],label:`Goal ${index+1}`,measure:"Demo measure",window:"This week",trend:index===4?"not enough data":"stable",target:"Demo range",progress:index===4?undefined:50}));
const activityMetric=(label:string,value:number,source:string,freshness:string):Activity["metrics"][number]=>({label,value,unit:label==="Steps"?"steps":label==="Sleep"?"hours":label==="Workouts"?"session":label==="Recorded heart rate"?"bpm":"kcal",source,freshness});
export const fixtureActivities:Activity[]=[
  {access:"connected",metrics:[activityMetric("Steps",7842,"Connected health","Updated 18 minutes ago"),activityMetric("Recorded heart rate",78,"Connected health","Latest recorded sample"),activityMetric("Sleep",7.4,"Connected health","Updated this morning"),activityMetric("Active energy",486,"Connected health","Updated 18 minutes ago"),activityMetric("Workouts",1,"Connected health","Today")]},
  {access:"connected",metrics:[activityMetric("Steps",3200,"Connected health","Updated 2 hours ago"),activityMetric("Sleep",6.8,"Connected health","Updated this morning")]},
  {access:"manual",metrics:[activityMetric("Workouts",1,"Added manually","Today")]},
  {access:"stale",metrics:[activityMetric("Steps",5100,"Connected health","Last synced 3 days ago")]},
  {access:"not-connected",metrics:[]},{access:"denied",metrics:[]},{access:"unavailable",metrics:[]}
];
export const fixtureNutritions:Nutrition[]=[{metrics:[
  {label:"Exact",value:100,unit:"kcal",target:100,provenance:"Demo target"},
  {label:"Below",value:30,unit:"g",range:[40,60],provenance:"Nutritionist plan"},
  {label:"Within",value:50,unit:"g",range:[40,60],provenance:"Your plan"},
  {label:"Above",value:80,unit:"g",range:[40,60],provenance:"Your plan"},
  {label:"Missing",unit:"g",target:40,provenance:"Demo target"},
  {label:"No target",value:20,unit:"g",provenance:"Demo target"},
  {label:"Zero target",value:0,unit:"g",target:0,provenance:"Demo target"}
]}];

const days=[
  day("2026-07-10","recorded",[meal("m1","Citrus oats","Breakfast","07:30",3.4,"completed")],"6.2k steps"),
  day("2026-07-11","empty",[]),
  day("2026-07-12","recorded",[meal("m2","Garden egg toast","Breakfast","08:00",4.7,"completed")],"8.1k steps"),
  {...day("2026-07-13","recorded",[meal("m3","Herby chickpea bowl","Lunch","12:30",6.8),meal("m4","Cocoa banana bites","Afternoon snack","16:00",2.6,"planned"),meal("m5","Lime chicken plate","Dinner","19:15",8.2,"planned")],"7.8k steps"),isToday:true},
  day("2026-07-14","future",[meal("m6","Apple overnight oats","Breakfast","07:30",3.9,"planned")]),
  day("2026-07-15","future",[meal("m7","Roasted veggie wrap","Lunch","12:30",5.7,"planned"),conflictMeal]),
  day("2026-07-16","unavailable",[])
];
const model:DashboardViewModel={locale:"en-US",currency:"USD",timeZone:"America/Costa_Rica",selectedDate:"2026-07-13",availableDateRange:["2026-07-10","2026-07-16"],budget:{amount:18,cadence:"day"},days,contextsByDate:Object.fromEntries(days.map(d=>[d.date,contexts.map(c=>({...c,label:c.kind==="activity"&&d.kind==="future"?"Activity unavailable":c.label,available:c.kind==="activity"&&d.kind==="future"?false:c.available}))])),sectionStates,reference:fixtureReferenceDashboard};

export const fixtureDashboardProvider:DashboardProvider={async getDashboard(){return structuredClone(model)}};
export const fixtureWithSectionState=(name:DashboardSectionName,status:DashboardSectionStatus):DashboardViewModel=>({...structuredClone(model),sectionStates:{...sectionStates,[name]:status}});
export const fixtureAskAviloProvider:AskAviloProvider={async ask({question,date,recommendation,contexts}){if(question.toLowerCase().includes("allergy"))return "I can’t safely recommend a conflicting meal. Please review the restriction with a qualified professional.";const budget=contexts.find(context=>context.kind==="budget")?.label??"the available budget context";return `For ${date}, ${recommendation??"the selected recommendation"} fits ${budget}. This is general nutrition assistance, not medical advice.`}};
