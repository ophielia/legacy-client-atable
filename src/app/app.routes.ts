import {RouterModule, Routes} from "@angular/router";
import {PocTagListComponent} from "./poc-tag-list/tag-list.component";
import {PocAddTagComponent} from "./poc-tag-list/add-tag.component";
import {PocEditTagComponent} from "./poc-tag-list/edit-tag.component";
import {PocDeleteTagComponent} from "app/poc-tag-list/delete-tag.component";
import {HomeComponent} from "./home.component";
import {LoginComponent} from "./login.component";
import {TagListComponent} from "./tag-list/tag-list.component";
import {EditDishComponent} from "./dish-list/edit-dish.component";
import {DishListComponent} from "./dish-list/dish-list.component";
import {MealPlanListComponent} from "./meal-plan-list/meal-plan-list.component";
import {EditMealPlanComponent} from "./meal-plan-list/edit-meal-plan.component";
import {ShoppingListListComponent} from "./shopping-list-list/shopping-list-list.component";
import {EditShoppingListComponent} from "./shopping-list-list/edit-shopping-list.component";
import {DishTagAssignToolComponent} from "./dish-tag-assign-tool/dish-tag-assign-tool.component";

const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'drilldown', component: TagListComponent},
  {path: 'list', component: PocTagListComponent},
  {path: 'dishes', component: PocTagListComponent},
  {path: 'add', component: PocAddTagComponent},
  {path: 'edit/:id', component: PocEditTagComponent},
  {path: 'delete/:id', component: PocDeleteTagComponent},
  {path: 'dish/list', component: DishListComponent},
  {path: 'dish/add', component: DishListComponent},
  {path: 'dish/edit/:id', component: EditDishComponent},
  {path: 'dish/delete/:id', component: PocDeleteTagComponent},
  {path: 'shoppinglist/list', component: ShoppingListListComponent},
  {path: 'shoppinglist/edit/:id', component: EditShoppingListComponent},
  {path: 'shoppinglist/delete/:id', component: ShoppingListListComponent},
  {path: 'mealplan/list', component: MealPlanListComponent},
  {path: 'mealplan/edit/:id', component: EditMealPlanComponent},
  {path: 'mealplan/delete/:id', component: MealPlanListComponent}, // MM will be delete component
  {path: 'tools/dishtotag', component: DishTagAssignToolComponent},
  {path: '', redirectTo: 'dish/list', pathMatch: 'full'}
];

export const routing = RouterModule.forRoot(routes);
