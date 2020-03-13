import {RouterModule, Routes} from "@angular/router";
import {LandingPadComponent} from "app/dashboard/landing-pad/landing-pad.component";
import {AddDishRatingComponent} from "./add-dish-rating/add-dish-rating.component";
import {AddDishGeneralComponent} from "./add-dish-general/add-dish-general.component";
import {AddDishIngredientComponent} from "./add-dish-ingredient/add-dish-ingredient.component";
import {AddDishFinishComponent} from "./add-dish-finish/add-dish-finish.component";
import {ManageDishComponent} from "./manage-dish/manage-dish.component";
import {AddDishCreateComponent} from "./add-dish-create/add-dish-create.component";
import {EditDishComponent} from "./edit-dish/edit-dish.component";
import {AuthGuard} from "../handlers/auth-guard";
import {RoleGuard} from "../handlers/role-guard";

const dishRoutes: Routes = [
  {path: 'home', component: LandingPadComponent},
  {path: 'adddish/ratings/:id', component: AddDishRatingComponent,canActivate: [AuthGuard]},
  {path: 'adddish/general/:id', component: AddDishGeneralComponent,canActivate: [AuthGuard]},
  {path: 'adddish/ingredients/:id', component: AddDishIngredientComponent,canActivate: [AuthGuard]},
  {path: 'adddish/finish/:id', component: AddDishFinishComponent,canActivate: [AuthGuard]},
  {path: 'editdish/:id', component: EditDishComponent,canActivate: [AuthGuard]},
  { path: 'managedishes', component: ManageDishComponent,canActivate: [AuthGuard]},
  {path: '', redirectTo: 'dish/list', pathMatch: 'full'},
  {
    path: 'adddish',
    component: AddDishCreateComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: 'ROLE_USER'
    }
  },
];

export const dishRouting = RouterModule.forRoot(dishRoutes);
