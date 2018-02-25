import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LandingPadComponent} from './landing-pad/landing-pad.component';
import {DishLandingComponent} from './dish-landing/dish-landing.component';
import {dashboardRouting} from "./dashboard.routes";
import {FormsModule} from "@angular/forms";
import {DEBUG_LOGGER_PROVIDERS, Logger} from "angular2-logger/core";
import {DishModule} from "../dish/dish.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    dashboardRouting,
    DishModule,
  ],
  providers: [Logger],
  declarations: [LandingPadComponent, DishLandingComponent]
})
export class DashboardModule {
}
