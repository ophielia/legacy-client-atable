import {RouterModule, Routes} from "@angular/router";
import {AddTagComponent} from "./legacy/tag-list/add-tag.component";
import {LoginComponent} from "./legacy/login/login.component";
import {DishTagAssignToolComponent} from "./legacy/dish-tag-assign-tool/dish-tag-assign-tool.component";
import {ListLayoutListComponent} from "./legacy/list-layout-list/list-layout-list.component";
import {TagTagAssignToolComponent} from "./legacy/tag-tag-assign-tool/tag-tag-assign-tool.component";
import {TargetListComponent} from "./legacy/target-list/target-list.component";
import {RatingTagAssignToolComponent} from "./legacy/rating-tag-assign-tool/rating-tag-assign-tool.component";
import {ManageShoppingListComponent} from "./shopping-list/shopping-list-manage/shopping-list-manage.component";

const routes: Routes = [
  {path: 'home', component: ManageShoppingListComponent},
  {path: 'login', component: LoginComponent},
  {path: 'add', component: AddTagComponent},
  {path: 'listlayout/list', component: ListLayoutListComponent},
  {path: 'tools/tagtotag', component: TagTagAssignToolComponent},
  {path: 'targets/list', component: TargetListComponent},
  {path: 'tools/dishtotag', component: DishTagAssignToolComponent},
  {path: 'tools/ratingtag', component: RatingTagAssignToolComponent},
  {path: '', redirectTo: 'home', pathMatch: 'full'}
];

export const routing = RouterModule.forRoot(routes);
