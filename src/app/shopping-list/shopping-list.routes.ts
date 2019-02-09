import {RouterModule, Routes} from "@angular/router";
import {LandingPadComponent} from "app/dashboard/landing-pad/landing-pad.component";
import {EditShoppingListComponent} from "./edit-shopping-list/edit-shopping-list.component";
import {ShoppingListComponent} from "./shopping-list/shopping-list.component";
import {QuickPickUpListComponent} from "./quick-pick-up-list/quick-pick-up-list.component";
import {ManageShoppingListComponent} from "./shopping-list-manage/shopping-list-manage.component";
import {EditPickupListComponent} from "./edit-pickup-list/edit-pickup-list.component";

const shoppingListRoutes: Routes = [
  {path: 'home', component: LandingPadComponent},
  {path: 'pickup', component: QuickPickUpListComponent},
  {path: 'managelists', component: ManageShoppingListComponent},
  {path: 'list/edit/:id', component: EditShoppingListComponent},
  {path: 'list/pickupedit/:id', component: EditPickupListComponent},
  {path: 'list/shop/:id', component: ShoppingListComponent},
  {path: '', redirectTo: 'home', pathMatch: 'full'}
];

export const shoppingListRouting = RouterModule.forRoot(shoppingListRoutes);
