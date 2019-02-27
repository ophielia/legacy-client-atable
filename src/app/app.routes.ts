import {RouterModule, Routes} from "@angular/router";
import {AddTagComponent} from "./legacy/tag-list/add-tag.component";
import {LoginComponent} from "./legacy/login/login.component";
import {MealPlanListComponent} from "./legacy/meal-plan-list/meal-plan-list.component";
import {ShoppingListListComponent} from "./legacy/shopping-list-list/shopping-list-list.component";
import {DishTagAssignToolComponent} from "./legacy/dish-tag-assign-tool/dish-tag-assign-tool.component";
import {ListLayoutListComponent} from "./legacy/list-layout-list/list-layout-list.component";
import {TagTagAssignToolComponent} from "./legacy/tag-tag-assign-tool/tag-tag-assign-tool.component";
import {TargetListComponent} from "./legacy/target-list/target-list.component";
import {RatingTagAssignToolComponent} from "./legacy/rating-tag-assign-tool/rating-tag-assign-tool.component";
import {LandingPadComponent} from "app/dashboard/landing-pad/landing-pad.component";

const routes: Routes = [
  {path: 'home', component: LandingPadComponent},
  {path: 'login', component: LoginComponent},
  {path: 'add', component: AddTagComponent},
  {path: 'shoppinglist/list', component: ShoppingListListComponent},
  {path: 'listlayout/list', component: ListLayoutListComponent},
  {path: 'tools/tagtotag', component: TagTagAssignToolComponent},
  {path: 'targets/list', component: TargetListComponent},
  {path: 'mealplan/list', component: MealPlanListComponent},
  {path: 'tools/dishtotag', component: DishTagAssignToolComponent},
  {path: 'tools/ratingtag', component: RatingTagAssignToolComponent},
  {path: '', redirectTo: 'home', pathMatch: 'full'}
];

export const routing = RouterModule.forRoot(routes);
