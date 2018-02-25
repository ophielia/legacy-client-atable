import {RouterModule, Routes} from "@angular/router";
import {LandingPadComponent} from "app/dashboard/landing-pad/landing-pad.component";
import {EditTagComponent} from "../legacy/tag-list/edit-tag.component";

const commonRoutes: Routes = [
  {path: 'home', component: LandingPadComponent},
  {path: 'edit/:id', component: EditTagComponent}
];

export const commonRouting = RouterModule.forRoot(commonRoutes);
