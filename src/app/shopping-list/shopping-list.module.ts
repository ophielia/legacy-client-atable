import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ManageShoppingListComponent} from './shopping-list-manage/shopping-list-manage.component';
import {BrowserModule} from "@angular/platform-browser";
import {FormsModule} from "@angular/forms";
import {dishRouting} from "../dish/dish.routes";
import {Angular2FontawesomeModule} from "angular2-fontawesome";
import {AppCommonModule} from "../app-common/app-common.module";
import {ShoppingListService} from "../services/shopping-list.service";
import {TagCommService} from "../legacy/drilldown/tag-drilldown-select.service";
import {shoppingListRouting} from "./shopping-list.routes";
import {EditShoppingListComponent} from "./edit-shopping-list/edit-shopping-list.component";
import {SourceLegendService} from "../services/source-legend.service";
import {ShoppingListItemsComponent} from './shopping-list-items/shopping-list-items.component';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    shoppingListRouting,
    Angular2FontawesomeModule,
    AppCommonModule

  ],
  providers: [ShoppingListService, TagCommService, SourceLegendService],
  declarations: [ManageShoppingListComponent, EditShoppingListComponent, ShoppingListItemsComponent]
})
export class ShoppingListModule {
}
