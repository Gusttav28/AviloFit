import AxeBuilder from "@axe-core/playwright";
import {expect,test,type Locator,type Page} from "@playwright/test";

async function tabTo(page:Page,target:Locator){
  for(let index=0;index<80;index++){
    if(await target.evaluate(element=>document.activeElement===element).catch(()=>false))return;
    await page.keyboard.press("Tab");
  }
  throw new Error(`Keyboard focus did not reach ${await target.getAttribute("aria-label")??await target.textContent()}`);
}

type GeometryBox={x:number;y:number;width:number;height:number};

const activityGeometryBaseline:Record<number,{summary:GeometryBox;progress:GeometryBox;cards:GeometryBox[]}>= {
  1440:{
    summary:{x:60,y:199.453125,width:505.4375,height:569.828125},
    progress:{x:60,y:785.28125,width:505.4375,height:112},
    cards:[
      {x:618.4375,y:315.609375,width:225.515625,height:246},
      {x:871.953125,y:315.609375,width:225.515625,height:246},
      {x:1125.46875,y:315.609375,width:225.515625,height:246},
      {x:618.4375,y:595.609375,width:225.515625,height:116},
      {x:871.953125,y:595.609375,width:225.515625,height:116},
      {x:1125.46875,y:595.609375,width:225.515625,height:116}
    ]
  },
  1024:{
    summary:{x:28,y:185.890625,width:407.625,height:571.828125},
    progress:{x:28,y:773.71875,width:407.625,height:143.609375},
    cards:[
      {x:480.625,y:298.046875,width:151.453125,height:264.859375},
      {x:650.078125,y:298.046875,width:151.453125,height:264.859375},
      {x:819.53125,y:298.046875,width:151.453125,height:264.859375},
      {x:480.625,y:587.90625,width:151.453125,height:116},
      {x:650.078125,y:587.90625,width:151.453125,height:116},
      {x:819.53125,y:587.90625,width:151.453125,height:116}
    ]
  },
  768:{
    summary:{x:28,y:257.890625,width:712,height:545.828125},
    progress:{x:28,y:819.71875,width:712,height:112},
    cards:[
      {x:51,y:1043.875,width:210,height:246},
      {x:279,y:1043.875,width:210,height:246},
      {x:507,y:1043.875,width:210,height:246},
      {x:51,y:1309.875,width:210,height:116},
      {x:279,y:1309.875,width:210,height:116},
      {x:507,y:1309.875,width:210,height:116}
    ]
  },
  360:{
    summary:{x:14,y:321.71875,width:332,height:473.828125},
    progress:{x:14,y:807.546875,width:332,height:234},
    cards:[
      {x:29,y:1145.703125,width:302,height:226.46875},
      {x:29,y:1386.171875,width:302,height:226.46875},
      {x:29,y:1626.640625,width:302,height:226.46875},
      {x:29,y:1873.109375,width:302,height:116},
      {x:29,y:2003.109375,width:302,height:116},
      {x:29,y:2133.109375,width:302,height:116}
    ]
  }
};

function expectPreservedBox(actual:GeometryBox,baseline:GeometryBox){
  for(const key of ["x","y","width","height"] as const){
    expect(Math.abs(actual[key]-baseline[key]),`${key} changed from the pre-change baseline`).toBeLessThanOrEqual(1);
  }
}

function expectPreservedShiftedBox(actual:GeometryBox,baseline:GeometryBox,yOffset:number){
  expect(Math.abs(actual.x-baseline.x),"x changed from the pre-change baseline").toBeLessThanOrEqual(1);
  expect(Math.abs(actual.y-(baseline.y+yOffset)),"y changed outside the added Ask Avilo flow offset").toBeLessThanOrEqual(1);
  expect(Math.abs(actual.width-baseline.width),"width changed from the pre-change baseline").toBeLessThanOrEqual(1);
  expect(Math.abs(actual.height-baseline.height),"height changed from the pre-change baseline").toBeLessThanOrEqual(1);
}

const historyLayoutBaseline:Record<number,{hero:GeometryBox;left:GeometryBox;activity:GeometryBox}>= {
  1440:{hero:{x:60,y:112,width:1320,height:63.453125},left:{x:60,y:199.453125,width:505.4375,height:697.828125},activity:{x:589.4375,y:199.453125,width:790.5625,height:569.84375}},
  1024:{hero:{x:28,y:108,width:968,height:53.890625},left:{x:28,y:185.890625,width:407.625,height:731.4375},activity:{x:455.625,y:185.890625,width:540.375,height:571.703125}},
  768:{hero:{x:28,y:180,width:712,height:53.890625},left:{x:28,y:257.890625,width:712,height:673.828125},activity:{x:28,y:955.71875,width:712,height:521.84375}},
  360:{hero:{x:14,y:184,width:332,height:117.71875},left:{x:14,y:321.71875,width:332,height:719.828125},activity:{x:14,y:1065.546875,width:332,height:1243.9375}}
};

for(const width of [1440,1024,768,360]){
  test(`meal and workout history panel at ${width}px`,async({page})=>{
    await page.setViewportSize({width,height:1600});
    await page.goto("/dashboard");

    const grid=page.locator(".reference-grid");
    const right=page.locator(".dashboard-right-column");
    const activity=right.locator(".activity-column");
    const panel=right.getByRole("region",{name:"Meal Recipes & Workout"});
    const tableRegion=panel.getByRole("region",{name:"Meal and workout history table for Monday, July 13, 2026"});
    const table=panel.getByRole("table",{name:"Meal and workout history for Monday, July 13, 2026"});

    await expect(grid.locator(":scope > *")).toHaveCount(2);
    expect(await right.evaluate(element=>element.parentElement?.classList.contains("reference-grid"))).toBe(true);
    expect(await activity.evaluate(element=>element.parentElement?.classList.contains("dashboard-right-column"))).toBe(true);
    expect(await panel.evaluate(element=>element.parentElement?.classList.contains("dashboard-right-column"))).toBe(true);
    expect(await right.evaluate(element=>[...element.children].map(child=>child.className))).toEqual(["activity-column","history-panel"]);
    await expect(panel.getByRole("heading",{name:"Meal Recipes & Workout"})).toBeVisible();
    await expect(panel.getByText("Avilo Fit Recipes History",{exact:true})).toBeVisible();
    await expect(panel.getByText("07 / 2026",{exact:true})).toBeVisible();
    await expect(table.getByRole("columnheader")).toHaveText(["Meal Name","Recipe","Value","Price"]);
    await expect(table.getByRole("row")).toHaveCount(3);
    for(const text of ["Post-workout lunch","Herby chickpea bowl","Workout -450 kcal","$6.80","Afternoon recovery","Cocoa banana bites","Workout -210 kcal","$2.60"]){
      await expect(panel.getByText(text,{exact:true})).toBeVisible();
    }
    const recipeCalories=panel.getByText("Recipe +420 kcal",{exact:true});
    await expect(recipeCalories).toHaveCount(2);
    for(const value of await recipeCalories.all())await expect(value).toBeVisible();

    const geometry=await page.evaluate(()=>{
      const box=(selector:string)=>{const rect=document.querySelector(selector)!.getBoundingClientRect();return {x:rect.x,y:rect.y,width:rect.width,height:rect.height,right:rect.right,bottom:rect.bottom}};
      const panel=document.querySelector(".history-panel") as HTMLElement;
      const scroll=document.querySelector(".history-table-scroll") as HTMLElement;
      const selected=document.querySelector('.history-date-button[aria-pressed="true"]') as HTMLElement;
      return {hero:box(".hero-row"),left:box(".dashboard-left-column"),summary:box(".summary-column"),progress:box(".progress-row"),ask:box(".ask-avilo-gooey"),activity:box(".activity-column"),history:box(".history-panel"),activityCards:[...document.querySelectorAll(".activity-metric")].map(element=>{const rect=element.getBoundingClientRect();return {x:rect.x,y:rect.y,width:rect.width,height:rect.height}}),gap:box(".history-panel").y-box(".activity-column").bottom,documentFits:document.documentElement.scrollWidth<=document.documentElement.clientWidth,panelFits:panel.scrollWidth<=panel.clientWidth,tableOverflow:{clientWidth:scroll.clientWidth,scrollWidth:scroll.scrollWidth},selected:{width:selected.getBoundingClientRect().width,height:selected.getBoundingClientRect().height,background:getComputedStyle(selected).backgroundColor}};
    });
    expectPreservedBox(geometry.hero,historyLayoutBaseline[width].hero);
    expect(Math.abs(geometry.left.x-historyLayoutBaseline[width].left.x)).toBeLessThanOrEqual(1);
    expect(Math.abs(geometry.left.y-historyLayoutBaseline[width].left.y)).toBeLessThanOrEqual(1);
    expect(Math.abs(geometry.left.width-historyLayoutBaseline[width].left.width)).toBeLessThanOrEqual(1);
    expectPreservedBox(geometry.summary,activityGeometryBaseline[width].summary);
    expectPreservedBox(geometry.progress,activityGeometryBaseline[width].progress);
    expect(geometry.ask.y).toBeGreaterThanOrEqual(geometry.progress.bottom);
    expect(Math.abs(geometry.ask.x-geometry.progress.x)).toBeLessThanOrEqual(1);
    expect(Math.abs(geometry.ask.width-geometry.progress.width)).toBeLessThanOrEqual(1);
    if(width>=1024){
      expectPreservedBox(geometry.activity,historyLayoutBaseline[width].activity);
      geometry.activityCards.forEach((box,index)=>expectPreservedBox(box,activityGeometryBaseline[width].cards[index]));
    }else{
      const activityYOffset=geometry.activity.y-historyLayoutBaseline[width].activity.y;
      expectPreservedShiftedBox(geometry.activity,historyLayoutBaseline[width].activity,activityYOffset);
      geometry.activityCards.forEach((box,index)=>expectPreservedShiftedBox(box,activityGeometryBaseline[width].cards[index],activityYOffset));
    }
    expect(Math.abs(geometry.gap-16)).toBeLessThanOrEqual(1);
    if(width>=1024){
      expect(Math.abs(geometry.activity.y-geometry.summary.y)).toBeLessThanOrEqual(1);
      expect(Math.abs(geometry.history.y-geometry.progress.y)).toBeLessThanOrEqual(1);
    }
    expect(geometry.documentFits).toBe(true);
    expect(geometry.panelFits).toBe(true);
    expect(geometry.selected.height).toBeGreaterThan(geometry.selected.width);
    expect(geometry.selected.background).not.toBe("rgba(0, 0, 0, 0)");
    expect(width===360?geometry.tableOverflow.scrollWidth>geometry.tableOverflow.clientWidth:geometry.tableOverflow.scrollWidth<=geometry.tableOverflow.clientWidth).toBe(true);

    const previous=panel.getByRole("button",{name:"Previous week"});
    const next=panel.getByRole("button",{name:"Next week"});
    await tabTo(page,previous);
    await page.keyboard.press("Enter");
    await expect(panel.getByRole("button",{name:"Monday, July 6, 2026"})).toHaveAttribute("aria-current","date");
    await tabTo(page,next);
    await page.keyboard.press("Space");
    await expect(panel.getByRole("button",{name:"Monday, July 13, 2026"})).toHaveAttribute("aria-current","date");
    const tuesday=panel.getByRole("button",{name:"Tuesday, July 14, 2026"});
    await tabTo(page,tuesday);
    await page.keyboard.press("Space");
    await expect(tuesday).toBeFocused();
    await expect(panel.getByText("Apple overnight oats",{exact:true})).toBeVisible();
    const thursday=panel.getByRole("button",{name:"Thursday, July 16, 2026"});
    await tabTo(page,thursday);
    await page.keyboard.press("Enter");
    await expect(thursday).toBeFocused();
    await expect(panel.getByRole("status")).toHaveText("No meal and workout history for this date.");
    await page.screenshot({path:`test-results/dashboard-history-${width}.png`,fullPage:true});

    await thursday.press("Shift+Tab");
    const wednesday=panel.getByRole("button",{name:"Wednesday, July 15, 2026"});
    await expect(wednesday).toBeFocused();
    await page.keyboard.press("Enter");
    const updatedRegion=panel.getByRole("region",{name:"Meal and workout history table for Wednesday, July 15, 2026"});
    await tabTo(page,updatedRegion);
    await expect(updatedRegion).toBeFocused();
    if(width===360){
      const before=await updatedRegion.evaluate(element=>element.scrollLeft);
      await page.keyboard.press("ArrowRight");
      const afterRight=await updatedRegion.evaluate(element=>element.scrollLeft);
      expect(afterRight).toBeGreaterThan(before);
      await page.keyboard.press("ArrowLeft");
      expect(await updatedRegion.evaluate(element=>element.scrollLeft)).toBeLessThan(afterRight);
    }
    await page.keyboard.press("Tab");
    expect(await panel.evaluate(element=>!element.contains(document.activeElement))).toBe(true);
    await expect(tableRegion).not.toBeAttached();
  });
}

for(const width of [1440,1024,768,360]){
  test(`activity shell content-driven geometry at ${width}px`,async({page})=>{
    await page.setViewportSize({width,height:1600});
    await page.goto("/dashboard");

    const referenceGrid=page.locator(".reference-grid");
    const activityColumn=page.locator(".activity-column");
    const activitySection=activityColumn.locator(".activity-section");
    const disclosure=activitySection.locator(".disclosure");
    const activityCards=activitySection.locator(".activity-metric");
    const tuneControl=activitySection.getByRole("button",{name:"Tune activity cards"});
    const detailsControl=activitySection.getByRole("button",{name:"Open activity details"});

    await expect(referenceGrid.locator(":scope > *")).toHaveCount(2);
    await expect(activitySection.getByRole("heading",{name:"Activity"})).toBeVisible();
    await expect(activitySection.getByText("Track your activity.",{exact:true})).toBeVisible();
    await expect(tuneControl).toBeVisible();
    await expect(detailsControl).toBeVisible();
    await expect(activityCards).toHaveCount(6);
    for(const text of ["Hydration","+11.5%","3.2 L","Steps","+4.5%","12,560","Sleep","-6.2%","7h 20m","Active Calories","-2.1%","450 kcal","Distance","+0.8km","8.4 km","Heart Rate","Stable","72 bpm"]){
      await expect(activitySection.getByText(text,{exact:true})).toBeVisible();
    }
    await expect(disclosure).toHaveText("Values are deterministic demo activity data, not medical findings.");

    const geometry=await page.evaluate(()=>{
      const box=(element:Element)=>{const rect=element.getBoundingClientRect();return {x:rect.x,y:rect.y,width:rect.width,height:rect.height,bottom:rect.bottom,right:rect.right}};
      const activity=document.querySelector(".activity-column")!;
      const activitySection=document.querySelector(".activity-section")!;
      const disclosure=document.querySelector(".activity-section .disclosure")!;
      const left=document.querySelector(".dashboard-left-column")!;
      const summary=document.querySelector(".summary-column")!;
      const progress=document.querySelector(".progress-row")!;
      const grid=document.querySelector(".reference-grid")!;
      const activityBox=box(activity);
      const descendants=[...activitySection.querySelectorAll("*")].map(box).filter(rect=>rect.width>0&&rect.height>0);
      return {
        activity:activityBox,
        disclosure:box(disclosure),
        left:box(left),
        summary:box(summary),
        progress:box(progress),
        ask:box(document.querySelector(".ask-avilo-gooey")!),
        cards:[...document.querySelectorAll(".activity-metric")].map(box),
        tail:activityBox.bottom-box(disclosure).bottom,
        gridAlignItems:getComputedStyle(grid).alignItems,
        activityStyle:{alignSelf:getComputedStyle(activity).alignSelf,maxHeight:getComputedStyle(activity).maxHeight,position:getComputedStyle(activity).position,overflow:getComputedStyle(activity).overflow},
        documentFits:document.documentElement.scrollWidth<=document.documentElement.clientWidth,
        activityFits:activity.scrollWidth<=activity.clientWidth,
        descendantsContained:descendants.every(rect=>rect.x>=activityBox.x-1&&rect.right<=activityBox.right+1&&rect.y>=activityBox.y-1&&rect.bottom<=activityBox.bottom+1)
      };
    });

    expect(geometry.gridAlignItems).toBe("stretch");
    expect(geometry.activityStyle).toEqual({alignSelf:"start",maxHeight:"none",position:"static",overflow:"visible"});
    expect(Math.abs(geometry.tail-({1440:29,1024:25,768:23,360:15}[width as 1440|1024|768|360]))).toBeLessThanOrEqual(1);
    expect(geometry.disclosure.bottom).toBeLessThanOrEqual(geometry.activity.bottom);
    expect(geometry.documentFits).toBe(true);
    expect(geometry.activityFits).toBe(true);
    expect(geometry.descendantsContained).toBe(true);

    const baseline=activityGeometryBaseline[width];
    expectPreservedBox(geometry.summary,baseline.summary);
    expectPreservedBox(geometry.progress,baseline.progress);
    expect(geometry.ask.y).toBeGreaterThanOrEqual(geometry.progress.bottom);
    expect(Math.abs(geometry.ask.x-geometry.progress.x)).toBeLessThanOrEqual(1);
    expect(Math.abs(geometry.ask.width-geometry.progress.width)).toBeLessThanOrEqual(1);
    if(width>=1024){
      geometry.cards.forEach((card,index)=>expectPreservedBox(card,baseline.cards[index]));
    }else{
      const activityYOffset=geometry.activity.y-historyLayoutBaseline[width].activity.y;
      geometry.cards.forEach((card,index)=>expectPreservedShiftedBox(card,baseline.cards[index],activityYOffset));
    }

    if(width>=1024){
      expect(Math.abs(geometry.activity.y-geometry.left.y)).toBeLessThanOrEqual(1);
      expect(geometry.activity.x).toBeGreaterThanOrEqual(geometry.left.right);
    }else{
      expect(Math.abs(geometry.activity.y-geometry.left.bottom-24)).toBeLessThanOrEqual(1);
    }

    await tabTo(page,tuneControl);
    await expect(tuneControl).toBeFocused();
    await tabTo(page,detailsControl);
    await expect(detailsControl).toBeFocused();
    const focusEvidence=await detailsControl.evaluate(element=>{
      const rect=element.getBoundingClientRect();
      const shell=element.closest(".activity-column")!.getBoundingClientRect();
      return {outline:getComputedStyle(element).outlineStyle,contained:rect.x>=shell.x&&rect.right<=shell.right&&rect.y>=shell.y&&rect.bottom<=shell.bottom};
    });
    expect(focusEvidence.outline).not.toBe("none");
    expect(focusEvidence.contained).toBe(true);
    await page.screenshot({path:`test-results/dashboard-activity-content-driven-${width}.png`,fullPage:true});
  });
}

for(const width of [360,768,1024,1440]){
  test(`compact progress card geometry at ${width}px`,async({page})=>{
    await page.setViewportSize({width,height:900});
    const interactionRequests:string[]=[];
    page.on("request",request=>{
      const url=new URL(request.url());
      if(!["127.0.0.1","localhost"].includes(url.hostname)||url.pathname.startsWith("/api"))interactionRequests.push(request.url());
    });
    await page.goto("/dashboard");
    interactionRequests.length=0;

    const referenceGrid=page.locator(".reference-grid");
    const leftColumn=page.locator(".dashboard-left-column");
    const summaryColumn=page.locator(".summary-column");
    const progressRow=leftColumn.getByRole("region",{name:"Progress goals"});
    const progressCards=progressRow.locator(".progress-card");
    const askInput=leftColumn.getByRole("region",{name:"Ask anything to Avilo AI"});
    const askField=askInput.getByRole("searchbox",{name:"Ask anything to Avilo AI"});
    const dismissButton=askInput.getByRole("button",{name:"Clear Ask Avilo input"});
    const activityColumn=page.locator(".activity-column");
    await expect(referenceGrid.locator(":scope > *")).toHaveCount(2);
    await expect(leftColumn.locator(":scope > *")).toHaveCount(3);
    expect(await progressRow.evaluate(element=>element.parentElement?.classList.contains("dashboard-left-column"))).toBe(true);
    expect(await progressRow.evaluate(element=>element.closest(".summary-column")===null)).toBe(true);
    expect(await askInput.evaluate(element=>element.parentElement?.classList.contains("dashboard-left-column"))).toBe(true);
    expect(await askInput.evaluate(element=>element.closest(".summary-column")===null&&element.closest(".progress-card")===null)).toBe(true);
    await expect(page.getByText("Ask anything to Avilo AI",{exact:true})).toHaveCount(1);
    await expect(askField).toBeVisible();
    await expect(dismissButton).toBeVisible();
    await expect(progressCards).toHaveCount(2);
    for(const text of ["Fat Loss Progress","4.2 kg","53%","Protein Goal","145 g/day","81%"]){
      await expect(progressRow.getByText(text,{exact:true})).toBeVisible();
    }

    const [leftBox,summaryBox,rowBox,askBox,activityBox,cardBoxes]=await Promise.all([
      leftColumn.boundingBox(),
      summaryColumn.boundingBox(),
      progressRow.boundingBox(),
      askInput.boundingBox(),
      activityColumn.boundingBox(),
      progressCards.evaluateAll(cards=>cards.map(card=>{
        const rect=card.getBoundingClientRect();
        return {x:rect.x,y:rect.y,width:rect.width,height:rect.height,clientWidth:card.clientWidth,scrollWidth:card.scrollWidth};
      }))
    ]);
    expect(leftBox).not.toBeNull();
    expect(summaryBox).not.toBeNull();
    expect(rowBox).not.toBeNull();
    expect(askBox).not.toBeNull();
    expect(activityBox).not.toBeNull();
    expect(rowBox!.y).toBeGreaterThanOrEqual(summaryBox!.y+summaryBox!.height);
    expect(askBox!.y).toBeGreaterThanOrEqual(rowBox!.y+rowBox!.height);
    expect(Math.abs(askBox!.x-rowBox!.x)).toBeLessThanOrEqual(1);
    expect(Math.abs(askBox!.width-rowBox!.width)).toBeLessThanOrEqual(1);
    expect(askBox!.height).toBeGreaterThanOrEqual(76);
    expect(cardBoxes.every(card=>card.width>0&&card.height>0&&card.scrollWidth<=card.clientWidth)).toBe(true);

    const collapsedGeometry=await askInput.evaluate(element=>{
      const label=element.querySelector(".ask-avilo-gooey-label")!.getBoundingClientRect();
      const shell=element.querySelector(".ask-avilo-gooey-shell") as HTMLElement;
      const input=element.querySelector(".ask-avilo-gooey-input") as HTMLElement;
      const clear=element.querySelector(".ask-avilo-gooey-dismiss") as HTMLElement;
      const shellRect=shell.getBoundingClientRect();
      const inputRect=input.getBoundingClientRect();
      const clearRect=clear.getBoundingClientRect();
      return {
        state:shell.dataset.state,
        labelBottom:label.bottom,
        inputTop:inputRect.top,
        shellWidth:shellRect.width,
        shellRight:shellRect.right,
        hostRight:element.getBoundingClientRect().right,
        clearWidth:clearRect.width,
        clearHeight:clearRect.height,
        inputScrollWidth:input.scrollWidth,
        inputClientWidth:input.clientWidth
      };
    });
    expect(collapsedGeometry.state).toBe("collapsed");
    expect(collapsedGeometry.labelBottom).toBeLessThanOrEqual(collapsedGeometry.inputTop);
    expect(collapsedGeometry.shellRight).toBeLessThanOrEqual(collapsedGeometry.hostRight+1);
    expect(collapsedGeometry.clearWidth).toBeGreaterThanOrEqual(width<768?40:36);
    expect(collapsedGeometry.clearHeight).toBeGreaterThanOrEqual(width<768?40:36);

    if(width===360){
      expect(Math.abs(cardBoxes[0].width-cardBoxes[1].width)).toBeLessThanOrEqual(1);
      expect(cardBoxes[1].y).toBeGreaterThanOrEqual(cardBoxes[0].y+cardBoxes[0].height);
    }else{
      expect(Math.abs(cardBoxes[0].width-cardBoxes[1].width)).toBeLessThanOrEqual(1);
      expect(Math.abs(cardBoxes[0].y-cardBoxes[1].y)).toBeLessThanOrEqual(1);
    }

    if(width>=1024){
      expect(activityBox!.x).toBeGreaterThanOrEqual(leftBox!.x+leftBox!.width);
    }else{
      expect(activityBox!.y).toBeGreaterThanOrEqual(leftBox!.y+leftBox!.height);
    }
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth)).toBe(true);
    await tabTo(page,askField);
    await expect(askField).toBeFocused();
    await expect(askInput.locator(".ask-avilo-gooey-shell")).toHaveAttribute("data-state","expanded");
    const expandedWidth=await askInput.locator(".ask-avilo-gooey-shell").evaluate(element=>element.getBoundingClientRect().width);
    expect(expandedWidth).toBeGreaterThanOrEqual(collapsedGeometry.shellWidth);
    await askField.fill("What should I eat after a workout?");
    await page.keyboard.press("Enter");
    await expect(askField).toHaveValue("What should I eat after a workout?");
    await page.keyboard.press("Escape");
    await expect(askField).toHaveValue("");
    await expect(askInput.locator(".ask-avilo-gooey-shell")).toHaveAttribute("data-state","collapsed");
    await askField.focus();
    await askField.fill("Protein dinner idea");
    await tabTo(page,dismissButton);
    await expect(dismissButton).toBeFocused();
    await dismissButton.click();
    await expect(askField).toHaveValue("");
    await expect(askInput.locator(".ask-avilo-gooey-shell")).toHaveAttribute("data-state","collapsed");
    await askField.focus();
    await askField.blur();
    await expect(askInput.locator(".ask-avilo-gooey-shell")).toHaveAttribute("data-state","collapsed");
    expect(interactionRequests).toEqual([]);
    await page.screenshot({path:`test-results/dashboard-ask-avilo-progress-${width}.png`,fullPage:true});
  });

  test(`dashboard reference redesign at ${width}px`,async({page})=>{
    await page.setViewportSize({width,height:900});
    const externalRequests:string[]=[];
    page.on("request",request=>{const url=new URL(request.url());if(!["127.0.0.1","localhost"].includes(url.hostname))externalRequests.push(request.url())});

    await page.goto("/dashboard");
    await expect(page.getByRole("link",{name:"Home"})).toBeVisible();
    await expect(page.getByRole("button",{name:"Notifications"})).toBeVisible();
    await expect(page.getByRole("button",{name:"Profile"})).toBeVisible();
    for(const utility of ["Search","Share","Calendar","Favorites","Location"]){
      await expect(page.getByRole("button",{name:utility})).toBeVisible();
    }
    await expect(page.getByRole("heading",{name:"Keep it up, Uzui!"})).toBeVisible();
    await expect(page.getByText("Track your nutrition, activity, and goals")).toBeVisible();
    await expect(page.getByRole("button",{name:/Filters/})).toBeVisible();
    await expect(page.getByRole("button",{name:/Reports/})).toBeVisible();

    await expect(page.getByRole("heading",{name:"Summary"})).toBeVisible();
    await expect(page.getByText("2,135,00")).toBeVisible();
    await expect(page.locator(".macro-stack")).toHaveCount(7);
    await expect(page.getByText("Carbohydrates (188gr)")).toBeVisible();

    await expect(page.getByRole("heading",{name:"Activity"})).toBeVisible();
    for(const value of ["3.2 L","12,560","7h 20m","450 kcal","8.4 km","72 bpm"])await expect(page.getByText(value,{exact:true})).toBeVisible();
    await expect(page.locator(".activity-metric.dark")).toContainText("Sleep");
    await expect(page.getByText("Fat Loss Progress")).toBeVisible();
    await expect(page.getByText("Protein Goal")).toBeVisible();

    expect(await page.evaluate(()=>{window.scrollTo(99999,0);return window.scrollX===0&&(document.scrollingElement?.scrollLeft??0)===0})).toBe(true);
    const accessibility=await new AxeBuilder({page}).analyze();
    const seriousCritical=accessibility.violations.filter(violation=>["serious","critical"].includes(violation.impact??""));
    const askViolations=seriousCritical.flatMap(violation=>violation.nodes.filter(node=>node.target.some(target=>target.includes("ask-avilo"))));
    expect(askViolations).toEqual([]);
    expect(externalRequests).toEqual([]);
    await page.screenshot({path:`test-results/dashboard-reference-${width}.png`,fullPage:true});
  });

  test(`dashboard reference keyboard path at ${width}px`,async({page})=>{
    await page.setViewportSize({width,height:900});
    await page.goto("/dashboard");
    await tabTo(page,page.getByRole("link",{name:"Home"}));
    await tabTo(page,page.getByRole("link",{name:"Energy shortcut"}));
    await tabTo(page,page.getByRole("link",{name:"Overview shortcut"}));
    await tabTo(page,page.getByRole("button",{name:"Notifications"}));
    await tabTo(page,page.getByRole("button",{name:"Profile"}));
    await tabTo(page,page.getByRole("button",{name:"Search"}));
    await tabTo(page,page.getByRole("button",{name:"Share"}));
    await tabTo(page,page.getByRole("button",{name:"Calendar"}));
    await tabTo(page,page.getByRole("button",{name:"Favorites"}));
    await tabTo(page,page.getByRole("button",{name:"Location"}));
    await tabTo(page,page.getByRole("button",{name:/Filters/}));
    await tabTo(page,page.getByRole("button",{name:/Reports/}));
    await tabTo(page,page.getByRole("searchbox",{name:"Ask anything to Avilo AI"}));
    await tabTo(page,page.getByRole("button",{name:"Clear Ask Avilo input"}));
    const focusEvidence=await page.getByRole("button",{name:"Clear Ask Avilo input"}).evaluate(element=>{
      const style=getComputedStyle(element);
      const rect=element.getBoundingClientRect();
      return {outline:style.outlineStyle,width:rect.width,height:rect.height};
    });
    expect(focusEvidence.outline).not.toBe("none");
    expect(focusEvidence.height).toBeGreaterThanOrEqual(width<768?42:36);
  });
}

for(const width of [360,768,1024]){
  test(`responsive utility controls remain reachable at ${width}px`,async({page})=>{
    await page.setViewportSize({width,height:900});
    await page.goto("/dashboard");
    for(const utility of ["Search","Share","Calendar","Favorites","Location"]){
      const button=page.getByRole("button",{name:utility});
      await expect(button).toBeVisible();
      await expect(button).toBeInViewport();
      const box=await button.boundingBox();
      expect(box?.width).toBeGreaterThanOrEqual(34);
      expect(box?.height).toBeGreaterThanOrEqual(34);
    }
    expect(await page.evaluate(()=>{window.scrollTo(99999,0);return window.scrollX===0&&(document.scrollingElement?.scrollLeft??0)===0})).toBe(true);
  });
}

test("desktop utility rail remains keyboard reachable",async({page})=>{
  await page.setViewportSize({width:1440,height:900});
  await page.goto("/dashboard");
  for(const utility of ["Search","Share","Calendar","Favorites","Location"]){
    await tabTo(page,page.getByRole("button",{name:utility}));
  }
});
