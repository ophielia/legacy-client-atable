import {RouterModule, Routes} from "@angular/router";
import {AddTagComponent} from "./tag-list/add-tag.component";
import {EditTagComponent} from "./tag-list/edit-tag.component";
import {HomeComponent} from "./home.component";
import {LoginComponent} from "./login/login.component";
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
import {AddDishCreateComponent} from "../dish/add-dish-create/add-dish-create.component";
import {RoleGuard} from "../handlers/role-guard";

const legacyRoutes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'add', component: AddTagComponent,canActivate: [RoleGuard],data: {expectedRole: 'ROLE_ADMIN'}},
  {path: 'edit/:id', component: EditTagComponent,canActivate: [RoleGuard],data: {expectedRole: 'ROLE_ADMIN'}},
  {path: 'listlayout/list', component: ListLayoutListComponent,canActivate: [RoleGuard],data: {expectedRole: 'ROLE_ADMIN'}},
  {path: 'listlayout/edit/:id', component: EditListLayoutComponent,canActivate: [RoleGuard],data: {expectedRole: 'ROLE_ADMIN'}},
  {path: 'listlayout/assign/:id', component: ListTagAssignToolComponent,canActivate: [RoleGuard],data: {expectedRole: 'ROLE_ADMIN'}},
  {path: 'listlayout/tools/category/:id', component: LayoutSubcategoryToolComponent,canActivate: [RoleGuard],data: {expectedRole: 'ROLE_ADMIN'}},
  {path: 'tools/tagtotag', component: TagTagAssignToolComponent,canActivate: [RoleGuard],data: {expectedRole: 'ROLE_ADMIN'}},
  {path: 'tools/delete', component: DeleteTagComponent,canActivate: [RoleGuard],data: {expectedRole: 'ROLE_ADMIN'}},
  {path: 'targets/list', component: TargetListComponent,canActivate: [RoleGuard],data: {expectedRole: 'ROLE_ADMIN'}},
  {path: 'targets/edit/:id', component: TargetEditComponent,canActivate: [RoleGuard],data: {expectedRole: 'ROLE_ADMIN'}},
  {path: 'proposal/edit/:id',component: ProposalEditComponent,canActivate: [RoleGuard],data: {expectedRole: 'ROLE_ADMIN'}},
  {path: 'tools/dishtotag',component: DishTagAssignToolComponent,canActivate: [RoleGuard],data: {expectedRole: 'ROLE_ADMIN'}},
  {path: 'tools/ratingtag',component: RatingTagAssignToolComponent,canActivate: [RoleGuard],data: {expectedRole: 'ROLE_ADMIN'}}

];

export const legacyRouting = RouterModule.forRoot(legacyRoutes);
