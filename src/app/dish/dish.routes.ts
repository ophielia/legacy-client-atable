import {RouterModule, Routes} from "@angular/router";
import {LandingPadComponent} from "app/dashboard/landing-pad/landing-pad.component";
import {AddDishRatingComponent} from "./add-dish-rating/add-dish-rating.component";
import {AddDishGeneralComponent} from "./add-dish-general/add-dish-general.component";
import {AddDishIngredientComponent} from "./add-dish-ingredient/add-dish-ingredient.component";
import {AddDishFinishComponent} from "./add-dish-finish/add-dish-finish.component";
import {ManageDishComponent} from "./manage-dish/manage-dish.component";
import {AddDishCreateComponent} from "./add-dish-create/add-dish-create.component";

const dishRoutes: Routes = [
  {path: 'home', component: LandingPadComponent},
  {path: 'adddish/ratings/:id', component: AddDishRatingComponent},
  {path: 'adddish', component: AddDishCreateComponent},
  {path: 'adddish/general/:id', component: AddDishGeneralComponent},
  {path: 'adddish/ingredients/:id', component: AddDishIngredientComponent},
  {path: 'adddish/finish/:id', component: AddDishFinishComponent},
  {path: 'managedishes', component: ManageDishComponent},
  {path: '', redirectTo: 'dish/list', pathMatch: 'full'}
];

export const dishRouting = RouterModule.forRoot(dishRoutes);
