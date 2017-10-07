import {Routes, RouterModule} from '@angular/router';
import {PocTagListComponent} from './poc-tag-list/tag-list.component';
import {PocAddTagComponent} from './poc-tag-list/add-tag.component';
import {PocEditTagComponent} from './poc-tag-list/edit-tag.component';
import {PocDeleteTagComponent} from "app/poc-tag-list/delete-tag.component";
import {HomeComponent} from "./home.component";
import {LoginComponent} from "./login.component";
import {TagListComponent} from "./tag-list/tag-list.component";

const routes: Routes = [
  { path: 'home',       component: HomeComponent },
  { path: 'login',       component: LoginComponent },
  { path: 'drilldown',       component: TagListComponent },
  { path: 'list', component: PocTagListComponent },
  { path: 'tags', component: PocTagListComponent },
  { path: 'add', component: PocAddTagComponent },
  { path: 'edit/:id', component: PocEditTagComponent },
  { path: 'delete/:id', component: PocDeleteTagComponent },
  { path: '', redirectTo: 'list', pathMatch: 'full'}
];

export const routing = RouterModule.forRoot(routes);
