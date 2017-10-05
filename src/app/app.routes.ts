import {Routes, RouterModule} from '@angular/router';
import {TagListComponent} from './tag-list/tag-list.component';
import {AddTagComponent} from './tag-list/add-tag.component';
import {EditTagComponent} from './tag-list/edit-tag.component';
import {DeleteTagComponent} from "app/tag-list/delete-tag.component";
import {HomeComponent} from "./home.component";
import {LoginComponent} from "./login.component";

const routes: Routes = [
  { path: 'home',       component: HomeComponent },
  { path: 'login',       component: LoginComponent },
  { path: 'list', component: TagListComponent },
  { path: 'tags', component: TagListComponent },
  { path: 'add', component: AddTagComponent },
  { path: 'edit/:id', component: EditTagComponent },
  { path: 'delete/:id', component: DeleteTagComponent },
  { path: '', redirectTo: 'list', pathMatch: 'full'}
];

export const routing = RouterModule.forRoot(routes);
