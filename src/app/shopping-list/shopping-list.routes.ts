import {RouterModule, Routes} from "@angular/router";
import {LandingPadComponent} from "app/dashboard/landing-pad/landing-pad.component";
import {EditShoppingListComponent} from "./edit-shopping-list/edit-shopping-list.component";
import {ShoppingListComponent} from "./shopping-list/shopping-list.component";

const shoppingListRoutes: Routes = [
  {path: 'home', component: LandingPadComponent},
  {path: 'list/edit/:id', component: EditShoppingListComponent},
  {path: 'list/shop/:id', component: ShoppingListComponent},
  {path: '', redirectTo: 'home', pathMatch: 'full'}
];

export const shoppingListRouting = RouterModule.forRoot(shoppingListRoutes);
