export type SectionState<T>={status:"loading"}|{status:"empty";message:string}|{status:"error";message:string}|{status:"ready";data:T};
export type PantryState="confirmed"|"assumed"|"unknown";
export type MealStatus="recommended"|"planned"|"completed"|"skipped"|"unavailable";
export type ActivityAccess="connected"|"manual"|"not-connected"|"denied"|"unavailable"|"stale";
export type ContextKind="budget"|"activity"|"nutrition-plan"|"preferences"|"pantry"|"grocery";
export interface Ingredient {name:string;quantity?:number;unit?:string;inPantry:boolean;pantryState:PantryState;estimatedCost?:number}
export interface Meal {id:string;name:string;occasion:string;time:string;calories:number;protein:number;carbs:number;fat:number;cost:number;status:MealStatus;ingredients:Ingredient[];allergyConflict?:string}
export interface Day {date:string;kind:"recorded"|"empty"|"future"|"unavailable"|"error";isToday?:boolean;planState:string;activitySignal?:string;mealSignal?:string;meals:Meal[];nutrition?:Nutrition;goal?:Goal;activity?:Activity}
export interface NutritionMetric {label:string;value?:number;unit:string;target?:number;range?:[number,number];provenance:"Your plan"|"Nutritionist plan"|"Demo target"}
export interface Nutrition {metrics:NutritionMetric[]}
export interface Goal {kind:"weight-loss"|"muscle-gain"|"maintenance"|"general-health"|"nutrition-adherence";label:string;measure:string;window:string;trend:"moving toward range"|"stable"|"not enough data";target?:string;progress?:number}
export interface ActivityMetric {label:string;value?:number;unit:string;source:string;freshness:string;tone?:"movement"|"connected"}
export interface Activity {access:ActivityAccess;metrics:ActivityMetric[]}
export interface ReferenceMacroBar {day:string;carbs:number;fat:number;protein:number}
export interface ReferenceLegendRow {label:string;color:"green"|"yellow"|"red";value:string;share:string;goal:string}
export interface ReferenceSummary {calorieIntake:string;activeBurn:string;bars:ReferenceMacroBar[];legend:ReferenceLegendRow[]}
export interface ReferenceActivityCard {label:string;value:string;trend:string;trendDirection:"up"|"down"|"stable";kind:"hydration"|"steps"|"sleep"|"calories"|"distance"|"heart";size:"large"|"compact";sparkline?:number[];progress?:number;note?:string}
export interface ReferenceProgressCard {label:string;description:string;value:string;percent:string;trend:"up"|"down"}
export interface ReferenceHistoryEntry {id:string;date:string;mealName:string;recipe:string;workoutCalories:number;recipeCalories:number;price:number}
export interface ReferenceHistoryData {selectedDate:string;availableDateRange:[string,string];entries:ReferenceHistoryEntry[]}
export interface DashboardReferenceData {summary:ReferenceSummary;activityCards:ReferenceActivityCard[];progressCards:ReferenceProgressCard[];history:ReferenceHistoryData}
export interface DailySummaryPreview {nutrition?:string;activity?:string}
export interface DailyDashboardSnapshot {preview:DailySummaryPreview;summary:ReferenceSummary;activityCards:ReferenceActivityCard[];progressCards:ReferenceProgressCard[]}
export interface ContextChip {kind:ContextKind;label:string;detail:string;available:boolean}
export interface AskAviloRequest {question:string;date:string;recommendation?:string;contexts:ContextChip[]}
export type DashboardSectionName="calendar"|"recommendations"|"nutrition"|"goal"|"activity"|"history"|"ai"|"performance"|"metrics"|"meals"|"workouts"|"insights";
export type DashboardSectionStatus="loading"|"ready"|"empty"|"error";
export interface FitCoreProgress {value:number;max:number}
export interface FitCorePerformance {goalPercent:number;title:string;message:string;points:number;metrics:{kind:string;label:string;value:string}[]}
export type FitCoreMetricKind="steps"|"water"|"calories"|"sleep";
export interface FitCoreQuickMetric {kind:FitCoreMetricKind;context:string;value:string;label:string;progress:FitCoreProgress}
export interface FitCoreMeal {id:string;state:"logged"|"scheduled";occasion:string;name?:string;suggestion?:string;time:string;calories?:number;protein?:number;carbs?:number;fat?:number;imageSrc?:string;imageAlt?:string}
export interface FitCoreCalendarDay {date:string;inCurrentMonth:boolean;hasEvent:boolean}
export interface FitCoreCalendarEvent {id:string;date:string;label:string;tone:"primary"|"neutral"}
export interface FitCoreWorkout {id:string;kind:"run"|"strength";name:string;durationMinutes:number;calories:number;averageHeartRate:number;progress:FitCoreProgress}
export interface FitCoreInsight {recommendation:string;recoveryPercent:number;disclaimer:string}
export interface FitCoreDashboardData {productName:string;searchPlaceholder:string;performance:FitCorePerformance;quickMetrics:FitCoreQuickMetric[];meals:FitCoreMeal[];calendarRange:[string,string];calendarDays:FitCoreCalendarDay[];events:FitCoreCalendarEvent[];workouts:FitCoreWorkout[];insight:FitCoreInsight}
export interface DashboardViewModel {locale:string;currency:string;timeZone:string;selectedDate:string;availableDateRange:[string,string];budget:{amount:number;cadence:"meal"|"day"|"week"};days:Day[];contextsByDate:Record<string,ContextChip[]>;sectionStates:Record<DashboardSectionName,DashboardSectionStatus>;reference:DashboardReferenceData;referenceByDate:Record<string,DailyDashboardSnapshot>;fitCore:FitCoreDashboardData}
export interface GroceryItem {name:string;quantity?:number;unit?:string;meals:string[];estimatedCost?:number}
