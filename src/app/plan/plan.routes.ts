import {RouterModule, Routes} from "@angular/router";
import {LandingPadComponent} from "app/dashboard/landing-pad/landing-pad.component";
import {EditMealPlanComponent} from "./edit-meal-plan/edit-meal-plan.component";
import {ManagePlansComponent} from "./manage-plans/manage-plans.component";
import {AddToMealPlanComponent} from "./add-to-meal-plan/add-to-meal-plan.component";
import {FillInMealPlanComponent} from "./fill-in-meal-plan/fill-in-meal-plan.component";
import {DinnerTonightOnHandComponent} from "./dinner-tonight-on-hand/dinner-tonight-on-hand.component";
import {DinnerTonightTargetComponent} from "./dinner-tonight-target/dinner-tonight-target.component";
import {DinnerTonightResultComponent} from "./dinner-tonight-result/dinner-tonight-result.component";
import {RateMealPlanComponent} from "./rate-meal-plan/rate-meal-plan.component";
import {AddDishFinishComponent} from "../dish/add-dish-finish/add-dish-finish.component";
import {AuthGuard} from "../handlers/auth-guard";

const planRoutes: Routes = [
  {path: 'home', component: LandingPadComponent},
  {path: 'plan/edit/:id', component: EditMealPlanComponent,canActivate: [AuthGuard]},
  {path: 'plan/add/:id', component: AddToMealPlanComponent,canActivate: [AuthGuard]},
  {path: 'plan/fillin/:id', component: FillInMealPlanComponent,canActivate: [AuthGuard]},
  {path: 'plan/rate/:id', component: RateMealPlanComponent,canActivate: [AuthGuard]},
  {path: 'plan/manage', component: ManagePlansComponent,canActivate: [AuthGuard]},
  {path: 'plan/dinnertonight/one', component: DinnerTonightOnHandComponent,canActivate: [AuthGuard]},
  {path: 'plan/dinnertonight/two/:id', component: DinnerTonightTargetComponent,canActivate: [AuthGuard]},
  {path: 'plan/dinnertonight/result/:id', component: DinnerTonightResultComponent,canActivate: [AuthGuard]},
  {path: '', redirectTo: 'home', pathMatch: 'full',canActivate: [AuthGuard]}
];

export const planRouting = RouterModule.forRoot(planRoutes);
