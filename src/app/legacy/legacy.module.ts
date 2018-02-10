import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PocTagListComponent} from "./poc-tag-list/tag-list.component";
import {PocAddTagComponent} from "./poc-tag-list/add-tag.component";
import {PocEditTagComponent} from "./poc-tag-list/edit-tag.component";
import {DishTagSelectComponent} from "./dish-list/dish-tag-select.component";
import {HomeComponent} from "./home.component";
import {LoginComponent} from "./login/login.component";
import {TagListComponent} from "./tag-list/tag-list.component";
import {DishListComponent} from "./dish-list/dish-list.component";
import {EditDishComponent} from "./dish-list/edit-dish.component";
import {MealPlanListComponent} from "./meal-plan-list/meal-plan-list.component";
import {EditMealPlanComponent} from "./meal-plan-list/edit-meal-plan.component";
import {ShoppingListListComponent} from "./shopping-list-list/shopping-list-list.component";
import {EditShoppingListComponent} from "./shopping-list-list/edit-shopping-list.component";
import {SingleListComponent} from "./shopping-list-list/single-list.component";
import {DishTagAssignToolComponent} from "./dish-tag-assign-tool/dish-tag-assign-tool.component";
import {ListLayoutListComponent} from "./list-layout-list/list-layout-list.component";
import {EditListLayoutComponent} from "./list-layout-list/edit-list-layout.component";
import {ListTagAssignToolComponent} from "./list-layout-list/list-tag-assign-tool.component";
import {TargetListComponent} from "./target-list/target-list.component";
import {TagTagAssignToolComponent} from "./tag-tag-assign-tool/tag-tag-assign-tool.component";
import {TargetEditComponent} from "./target-list/target-edit.component";
import {ProposalEditComponent} from "./proposal-edit/proposal-edit.component";
import {ProposalSlotComponentComponent} from "./proposal-slot-component/proposal-slot-component.component";
import {RatingTagAssignToolComponent} from "./rating-tag-assign-tool/rating-tag-assign-tool.component";
import {legacyRouting} from "./legacy.routes";
import {HttpModule} from "@angular/http";
import {FormsModule} from "@angular/forms";
import {BrowserModule} from "@angular/platform-browser";
import {AutoCompleteModule} from "primeng/primeng";
import {DragulaModule} from "ng2-dragula";
import {Angular2FontawesomeModule} from "angular2-fontawesome";
import {DrilldownModule} from "./drilldown/drilldown.module";
import {ProposalService} from "../services/proposal.service";
import {TargetService} from "../services/target.service";
import {AuthenticationService} from "../authentication.service";
import {ListLayoutService} from "../services/list-layout.service";
import {TagCommService} from "./drilldown/tag-drilldown-select.service";
import {ShoppingListService} from "../services/shopping-list.service";
import {MealPlanService} from "../services/meal-plan.service";
import {DishService} from "../services/dish-service.service";
import {TagsService} from "../services/tags.service";
import {APP_CONFIG, AppConfig, AppConfigModule} from "app/app.config";

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    legacyRouting,
    DrilldownModule,
    Angular2FontawesomeModule,
    DragulaModule,
    AutoCompleteModule,
    AppConfigModule
  ],
  declarations: [
    PocTagListComponent,
    PocAddTagComponent,
    PocEditTagComponent,
    DishTagSelectComponent,
    HomeComponent,
    TagListComponent,
    LoginComponent,
    DishListComponent,
    EditDishComponent,
    MealPlanListComponent,
    EditMealPlanComponent,
    ShoppingListListComponent,
    EditShoppingListComponent,
    SingleListComponent,
    DishTagAssignToolComponent,
    ListLayoutListComponent,
    EditListLayoutComponent,
    ListTagAssignToolComponent,
    TagTagAssignToolComponent,
    TargetListComponent,
    TargetEditComponent,
    ProposalEditComponent,
    ProposalSlotComponentComponent,
    RatingTagAssignToolComponent
  ],
  providers: [{
    provide: APP_CONFIG,
    useValue: AppConfig
  }, TagsService, DishService, MealPlanService, ShoppingListService, TagCommService, ListLayoutService, AuthenticationService, TargetService, ProposalService],
})
export class LegacyModule {
}