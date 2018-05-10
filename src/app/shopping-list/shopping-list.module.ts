import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {ManageShoppingListComponent} from "./shopping-list-manage/shopping-list-manage.component";
import {BrowserModule} from "@angular/platform-browser";
import {FormsModule} from "@angular/forms";
import {Angular2FontawesomeModule} from "angular2-fontawesome";
import {AppCommonModule} from "../app-common/app-common.module";
import {ShoppingListService} from "../services/shopping-list.service";
import {TagCommService} from "../legacy/drilldown/tag-drilldown-select.service";
import {shoppingListRouting} from "./shopping-list.routes";
import {EditShoppingListComponent} from "./edit-shopping-list/edit-shopping-list.component";
import {SourceLegendService} from "../services/source-legend.service";
import {ShoppingListItemsComponent} from "./shopping-list-items/shopping-list-items.component";
import {AutoCompleteModule, CheckboxModule} from "primeng/primeng";
import {SingleListComponentComponent} from "./single-list-component/single-list-component.component";
import {ShoppingListComponent} from "./shopping-list/shopping-list.component";
import {CrossOffItemComponent} from "./cross-off-item/cross-off-item.component";
import {ColorTagsComponent} from "./color-tags/color-tags.component";
import {WordTagsComponent} from "./word-tags/word-tags.component";
import {QuickPickUpListComponent} from './quick-pick-up-list/quick-pick-up-list.component';


@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    shoppingListRouting,
    Angular2FontawesomeModule,
    AppCommonModule,
    AutoCompleteModule,
    CheckboxModule

  ],
  providers: [ShoppingListService, TagCommService, SourceLegendService],
  declarations: [ManageShoppingListComponent, EditShoppingListComponent,
    ShoppingListItemsComponent, SingleListComponentComponent, ShoppingListComponent, CrossOffItemComponent,
    ColorTagsComponent, WordTagsComponent, QuickPickUpListComponent]
})
export class ShoppingListModule {
}
