import {RouterModule, Routes} from "@angular/router";
import {TagListComponent} from "./tag-list/tag-list.component";
import {AddTagComponent} from "./tag-list/add-tag.component";
import {EditTagComponent} from "./tag-list/edit-tag.component";
import {HomeComponent} from "./home.component";
import {LoginComponent} from "./login/login.component";
import {EditDishComponent} from "./dish-list/edit-dish.component";
import {MealPlanListComponent} from "./meal-plan-list/meal-plan-list.component";
import {EditMealPlanComponent} from "./meal-plan-list/edit-meal-plan.component";
import {ShoppingListListComponent} from "./shopping-list-list/shopping-list-list.component";
import {EditShoppingListComponent} from "./shopping-list-list/edit-shopping-list.component";
import {DishTagAssignToolComponent} from "./dish-tag-assign-tool/dish-tag-assign-tool.component";
import {ListLayoutListComponent} from "./list-layout-list/list-layout-list.component";
import {EditListLayoutComponent} from "./list-layout-list/edit-list-layout.component";
import {ListTagAssignToolComponent} from "./list-layout-list/list-tag-assign-tool.component";
import {TagTagAssignToolComponent} from "./tag-tag-assign-tool/tag-tag-assign-tool.component";
import {TargetListComponent} from "./target-list/target-list.component";
import {TargetEditComponent} from "./target-list/target-edit.component";
import {ProposalEditComponent} from "app/legacy/proposal-edit/proposal-edit.component";
import {RatingTagAssignToolComponent} from "./rating-tag-assign-tool/rating-tag-assign-tool.component";
import {LayoutSubcategoryToolComponent} from "./layout-subcategory-tool/layout-subcategory-tool.component";
import {DeleteTagComponent} from "./delete-tag/delete-tag.component";

const legacyRoutes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'list', component: TagListComponent},
  {path: 'add', component: AddTagComponent},
  {path: 'edit/:id', component: EditTagComponent},
  {path: 'dish/edit/:id', component: EditDishComponent},
  {path: 'shoppinglist/list', component: ShoppingListListComponent},
  {path: 'shoppinglist/edit/:id', component: EditShoppingListComponent},
  {path: 'shoppinglist/delete/:id', component: ShoppingListListComponent},
  {path: 'listlayout/list', component: ListLayoutListComponent},
  {path: 'listlayout/edit/:id', component: EditListLayoutComponent},
  {path: 'listlayout/assign/:id', component: ListTagAssignToolComponent},
  {path: 'listlayout/tools/category/:id', component: LayoutSubcategoryToolComponent},
  {path: 'tools/tagtotag', component: TagTagAssignToolComponent},
  {path: 'tools/delete', component: DeleteTagComponent},
  {path: 'targets/list', component: TargetListComponent},
  {path: 'targets/edit/:id', component: TargetEditComponent},
  {path: 'proposal/edit/:id', component: ProposalEditComponent},
  {path: 'mealplan/list', component: MealPlanListComponent},
  {path: 'mealplan/edit/:id', component: EditMealPlanComponent},
  {path: 'mealplan/delete/:id', component: MealPlanListComponent}, // MM will be delete component
  {path: 'tools/dishtotag', component: DishTagAssignToolComponent},
  {path: 'tools/ratingtag', component: RatingTagAssignToolComponent},
  {path: '', redirectTo: 'dish/list', pathMatch: 'full'}
];

export const legacyRouting = RouterModule.forRoot(legacyRoutes);
