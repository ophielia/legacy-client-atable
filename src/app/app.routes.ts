import {RouterModule, Routes} from "@angular/router";
import {TagListComponent} from "./legacy/tag-list/tag-list.component";
import {AddTagComponent} from "./legacy/tag-list/add-tag.component";
import {EditTagComponent} from "./legacy/tag-list/edit-tag.component";
import {HomeComponent} from "./legacy/home.component";
import {LoginComponent} from "./legacy/login/login.component";
import {EditDishComponent} from "./legacy/dish-list/edit-dish.component";
import {DishListComponent} from "./legacy/dish-list/dish-list.component";
import {MealPlanListComponent} from "./legacy/meal-plan-list/meal-plan-list.component";
import {EditMealPlanComponent} from "./legacy/meal-plan-list/edit-meal-plan.component";
import {ShoppingListListComponent} from "./legacy/shopping-list-list/shopping-list-list.component";
import {EditShoppingListComponent} from "./legacy/shopping-list-list/edit-shopping-list.component";
import {DishTagAssignToolComponent} from "./legacy/dish-tag-assign-tool/dish-tag-assign-tool.component";
import {ListLayoutListComponent} from "./legacy/list-layout-list/list-layout-list.component";
import {EditListLayoutComponent} from "./legacy/list-layout-list/edit-list-layout.component";
import {ListTagAssignToolComponent} from "./legacy/list-layout-list/list-tag-assign-tool.component";
import {TagTagAssignToolComponent} from "./legacy/tag-tag-assign-tool/tag-tag-assign-tool.component";
import {TargetListComponent} from "./legacy/target-list/target-list.component";
import {TargetEditComponent} from "./legacy/target-list/target-edit.component";
import {ProposalEditComponent} from "app/legacy/proposal-edit/proposal-edit.component";
import {RatingTagAssignToolComponent} from "./legacy/rating-tag-assign-tool/rating-tag-assign-tool.component";
import {LandingPadComponent} from "app/dashboard/landing-pad/landing-pad.component";

const routes: Routes = [
  {path: 'home', component: LandingPadComponent},
  {path: 'login', component: LoginComponent},
  {path: 'list', component: TagListComponent},
  {path: 'add', component: AddTagComponent},
  {path: 'dish/list', component: DishListComponent},
  {path: 'dish/add', component: DishListComponent},
  {path: 'dish/edit/:id', component: EditDishComponent},
  {path: 'shoppinglist/list', component: ShoppingListListComponent},
  {path: 'listlayout/list', component: ListLayoutListComponent},
  {path: 'tools/tagtotag', component: TagTagAssignToolComponent},
  {path: 'targets/list', component: TargetListComponent},
  {path: 'mealplan/list', component: MealPlanListComponent},
  {path: 'tools/dishtotag', component: DishTagAssignToolComponent},
  {path: 'tools/ratingtag', component: RatingTagAssignToolComponent},
  {path: '', redirectTo: 'dish/list', pathMatch: 'full'}
];

export const routing = RouterModule.forRoot(routes);
