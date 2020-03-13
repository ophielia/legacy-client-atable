import {RouterModule, Routes} from "@angular/router";
import {LandingPadComponent} from "app/dashboard/landing-pad/landing-pad.component";
import {EditShoppingListComponent} from "./edit-shopping-list/edit-shopping-list.component";
import {ManageShoppingListComponent} from "./shopping-list-manage/shopping-list-manage.component";
import {AddToMealPlanComponent} from "../plan/add-to-meal-plan/add-to-meal-plan.component";
import {AuthGuard} from "../handlers/auth-guard";

const shoppingListRoutes: Routes = [
  {path: 'home', component: LandingPadComponent},
  {path: 'managelists', component: ManageShoppingListComponent,canActivate: [AuthGuard]},
  {path: 'list/edit/:id', component: EditShoppingListComponent,canActivate: [AuthGuard]},
  {path: '', redirectTo: 'home', pathMatch: 'full'}
];

export const shoppingListRouting = RouterModule.forRoot(shoppingListRoutes);
