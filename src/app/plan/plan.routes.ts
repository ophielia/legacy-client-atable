import {RouterModule, Routes} from "@angular/router";
import {LandingPadComponent} from "app/dashboard/landing-pad/landing-pad.component";
import {EditMealPlanComponent} from "./edit-meal-plan/edit-meal-plan.component";
import {EditShoppingListComponent} from "../shopping-list/edit-shopping-list/edit-shopping-list.component";
import {ManagePlansComponent} from "./manage-plans/manage-plans.component";
import {AddToMealPlanComponent} from "./add-to-meal-plan/add-to-meal-plan.component";
import {FillInMealPlanComponent} from "./fill-in-meal-plan/fill-in-meal-plan.component";
import {DinnerTonightOnHandComponent} from "./dinner-tonight-on-hand/dinner-tonight-on-hand.component";
import {DinnerTonightTargetComponent} from "./dinner-tonight-target/dinner-tonight-target.component";
import {DinnerTonightResultComponent} from "./dinner-tonight-result/dinner-tonight-result.component";

const planRoutes: Routes = [
  {path: 'home', component: LandingPadComponent},
  {path: 'plan/edit/:id', component: EditMealPlanComponent},
  {path: 'plan/add/:id', component: AddToMealPlanComponent},
  {path: 'plan/fillin/:id', component: FillInMealPlanComponent},
  {path: 'plan/manage', component: ManagePlansComponent},
  {path: 'plan/dinnertonight/one', component: DinnerTonightOnHandComponent},
  {path: 'plan/dinnertonight/two/:id', component: DinnerTonightTargetComponent},
  {path: 'plan/dinnertonight/result/:id', component: DinnerTonightResultComponent},
  {path: 'list/edit/:id', component: EditShoppingListComponent},
  {path: '', redirectTo: 'home', pathMatch: 'full'}
];

export const planRouting = RouterModule.forRoot(planRoutes);
