import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EditMealPlanComponent} from './edit-meal-plan/edit-meal-plan.component';
import {ManagePlansComponent} from './manage-plans/manage-plans.component';
import {SinglePlanComponent} from './single-plan/single-plan.component';
import {planRouting} from "./plan.routes";
import {FormsModule} from "@angular/forms";
import {BrowserModule} from "@angular/platform-browser";
import {Angular2FontawesomeModule} from "angular2-fontawesome";
import {AppCommonModule} from "../app-common/app-common.module";
import {AddToMealPlanComponent} from './add-to-meal-plan/add-to-meal-plan.component';
import {FillInMealPlanComponent} from './fill-in-meal-plan/fill-in-meal-plan.component';
import {DinnerTonightOnHandComponent} from './dinner-tonight-on-hand/dinner-tonight-on-hand.component';
import {DinnerTonightTargetComponent} from './dinner-tonight-target/dinner-tonight-target.component';
import {DinnerTonightResultComponent} from './dinner-tonight-result/dinner-tonight-result.component';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    planRouting,
    Angular2FontawesomeModule,
    AppCommonModule
  ],
  declarations: [EditMealPlanComponent, ManagePlansComponent, SinglePlanComponent, AddToMealPlanComponent, FillInMealPlanComponent, DinnerTonightOnHandComponent, DinnerTonightTargetComponent, DinnerTonightResultComponent]
})
export class PlanModule {
}
