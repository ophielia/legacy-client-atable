import {RouterModule, Routes} from "@angular/router";
import {LandingPadComponent} from "./landing-pad/landing-pad.component";
import {AddDishCreateComponent} from "../dish/add-dish-create/add-dish-create.component";
import {DashboardManageDishesComponent} from "./dashboard-manage-dishes/dashboard-manage-dishes.component";
import {AddDishRatingComponent} from "../dish/add-dish-rating/add-dish-rating.component";
import {ManageDishComponent} from "../dish/manage-dish/manage-dish.component";
import {ManageShoppingListComponent} from "app/shopping-list/shopping-list-manage/shopping-list-manage.component";
import {QuickPickUpListComponent} from "../shopping-list/quick-pick-up-list/quick-pick-up-list.component";
import {ShoppingListComponent} from "app/shopping-list/shopping-list/shopping-list.component";

const dashboardRoutes: Routes = [
  {path: 'home', component: LandingPadComponent},
  {path: 'adddish', component: AddDishCreateComponent},
  {path: 'pickup', component: QuickPickUpListComponent},
  {path: 'shop', component: ShoppingListComponent},
  {path: 'managedishes', component: ManageDishComponent},
  {path: 'manageshoppinglists', component: ManageShoppingListComponent},
  {path: 'adddish/ratings/:id', component: AddDishRatingComponent},
  {path: 'dishes', component: DashboardManageDishesComponent},
  {path: '', redirectTo: 'dish/list', pathMatch: 'full'}
];

export const dashboardRouting = RouterModule.forRoot(dashboardRoutes);
