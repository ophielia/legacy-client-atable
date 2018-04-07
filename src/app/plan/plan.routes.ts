import {RouterModule, Routes} from "@angular/router";
import {LandingPadComponent} from "app/dashboard/landing-pad/landing-pad.component";
import {EditMealPlanComponent} from "./edit-meal-plan/edit-meal-plan.component";
import {EditShoppingListComponent} from "../shopping-list/edit-shopping-list/edit-shopping-list.component";

const planRoutes: Routes = [
  {path: 'home', component: LandingPadComponent},
  {path: 'plan/edit/:id', component: EditMealPlanComponent},
  {path: 'list/edit/:id', component: EditShoppingListComponent},
  {path: '', redirectTo: 'home', pathMatch: 'full'}
];

export const planRouting = RouterModule.forRoot(planRoutes);
