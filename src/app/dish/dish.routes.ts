import {RouterModule, Routes} from "@angular/router";
import {LandingPadComponent} from "app/dashboard/landing-pad/landing-pad.component";
import {AddDishRatingComponent} from "./add-dish-rating/add-dish-rating.component";
import {AddDishGeneralComponent} from "./add-dish-general/add-dish-general.component";
import {AddDishIngredientComponent} from "./add-dish-ingredient/add-dish-ingredient.component";
import {AddDishFinishComponent} from "./add-dish-finish/add-dish-finish.component";
import {EditDishComponent} from "./edit-dish/edit-dish.component";
import {ManageDishComponent} from "./manage-dish/manage-dish.component";
import {EditMealPlanComponent} from "../plan/edit-meal-plan/edit-meal-plan.component";

const dishRoutes: Routes = [
  {path: 'home', component: LandingPadComponent},
  {path: 'adddish/ratings/:id', component: AddDishRatingComponent},
  {path: 'adddish/general/:id', component: AddDishGeneralComponent},
  {path: 'adddish/ingredients/:id', component: AddDishIngredientComponent},
  {path: 'adddish/finish/:id', component: AddDishFinishComponent},
  {path: 'editdish/edit/:id', component: EditDishComponent},
  {path: 'plan/edit/:id', component: EditMealPlanComponent},
  {path: 'managedishes', component: ManageDishComponent},
  {path: '', redirectTo: 'dish/list', pathMatch: 'full'}
];

export const dishRouting = RouterModule.forRoot(dishRoutes);
