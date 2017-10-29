import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";

import {AppComponent} from "./app.component";
import {PocTagListComponent} from "./poc-tag-list/tag-list.component";
import {routing} from "./app.routes";
import {PocAddTagComponent} from "./poc-tag-list/add-tag.component";
import {PocEditTagComponent} from "./poc-tag-list/edit-tag.component";
import {PocDeleteTagComponent} from "./poc-tag-list/delete-tag.component";
import {HomeComponent} from "./home.component";
import {AuthenticationService} from "./authentication.service";
import {LoginComponent} from "./login.component";
import {TagsService} from "./tags.service";
import {TagListComponent} from "./tag-list/tag-list.component";
import {DishListComponent} from "./dish-list/dish-list.component";
import {DishService} from "./dish-service.service";
import {EditDishComponent} from "./dish-list/edit-dish.component";
import {DrilldownModule} from "./drilldown/drilldown.module";
import {PocTagDrilldownComponent} from "./tag-list/tag-drilldown.component";
import {DishTagSelectComponent} from "./dish-list/dish-tag-select.component";
import {MealPlanListComponent} from './meal-plan-list/meal-plan-list.component';
import {MealPlanService} from "./meal-plan.service";
import {EditMealPlanComponent} from './meal-plan-list/edit-meal-plan.component';

@NgModule({
  declarations: [
    AppComponent,
    PocTagListComponent,
    PocAddTagComponent,
    PocEditTagComponent,
    PocDeleteTagComponent,
    PocTagDrilldownComponent,
    DishTagSelectComponent,
    HomeComponent,
    TagListComponent,
    LoginComponent,
    DishListComponent,
    EditDishComponent,
    MealPlanListComponent,
    EditMealPlanComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing,
    DrilldownModule
  ],
  providers: [TagsService, DishService, MealPlanService, AuthenticationService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
