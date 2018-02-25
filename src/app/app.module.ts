import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";

import {AppComponent} from "./app.component";
import {routing} from "./app.routes";
import {LegacyModule} from "app/legacy/legacy.module";
import {AppCommonModule} from "./app-common/app-common.module";
import {NavigationComponent} from "./navigation/navigation.component";
import {DashboardModule} from "./dashboard/dashboard.module";
import {AddDishCreateComponent} from "./dish/add-dish-create/add-dish-create.component";
import {DashboardManageDishesComponent} from "./dashboard/dashboard-manage-dishes/dashboard-manage-dishes.component";


@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    AddDishCreateComponent,
    DashboardManageDishesComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing,
    LegacyModule,
    AppCommonModule,
    DashboardModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
