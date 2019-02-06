import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AddDishRatingComponent} from './add-dish-rating/add-dish-rating.component';
import {DishService} from "../services/dish-service.service";
import {dishRouting} from "./dish.routes";
import {Angular2FontawesomeModule} from "angular2-fontawesome";
import {AddDishGeneralComponent} from "./add-dish-general/add-dish-general.component";
import {DishWindowComponent} from './dish-window/dish-window.component';
import {FormsModule} from "@angular/forms";
import {BrowserModule} from "@angular/platform-browser";
import {AppCommonModule} from "../app-common/app-common.module";
import {TagCommService} from "../legacy/drilldown/tag-drilldown-select.service";
import {AddDishIngredientComponent} from './add-dish-ingredient/add-dish-ingredient.component';
import {AddDishFinishComponent} from './add-dish-finish/add-dish-finish.component';
import {ManageDishComponent} from './manage-dish/manage-dish.component';
import {EditDishComponent} from './edit-dish/edit-dish.component';
import {PlanModule} from "../plan/plan.module";
import {DishFilterSelectCommService} from "../app-common/dish-filter-select/dish-filter-select-comm.service";

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    PlanModule,
    dishRouting,
    Angular2FontawesomeModule,
    AppCommonModule
  ],
  providers: [DishService, TagCommService, DishFilterSelectCommService],
  declarations: [AddDishRatingComponent, AddDishGeneralComponent,
    DishWindowComponent, AddDishIngredientComponent,
    AddDishFinishComponent, ManageDishComponent, EditDishComponent]
})
export class DishModule {
}
