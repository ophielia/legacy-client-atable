import {NgModule} from "@angular/core";
import {TagBrowseComponent} from "./tag-browse/tag-browse.component";
import {TagBrowseNodeComponent} from "./tag-browse/tag-browse-node.component";
import {BrowserModule} from "@angular/platform-browser";
import {CommonModule} from "@angular/common";
import {TagsService} from "../services/tags.service";
import {TagCommService} from "../legacy/drilldown/tag-drilldown-select.service";
import {Angular2FontawesomeModule} from "angular2-fontawesome";
import {commonRouting} from "./common.routes";
import {TagBrowseStyleDirective} from "./tag-browse-style.directive";
import {TagSelectComponent} from "./tag-select/tag-select.component";
import {AutoCompleteModule} from "primeng/primeng";

import {FormsModule} from "@angular/forms";
import {ModalComponent} from "./modal/modal";
import {DishSelectComponent} from "./dish-select/dish-select.component";
import {GenerateListComponent} from "./generate-list/generate-list.component";
import {DishFilterSelectComponent} from "./dish-filter-select/dish-filter-select.component";
import {AlertService} from "../services/alert.service";
import {DishFilterSelectCommService} from "./dish-filter-select/dish-filter-select-comm.service";

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    Angular2FontawesomeModule,
    AutoCompleteModule,
    commonRouting
  ],
  providers: [TagsService, TagCommService, DishFilterSelectCommService, AlertService],
  declarations: [TagBrowseComponent, TagBrowseNodeComponent,
    GenerateListComponent, TagBrowseStyleDirective, ModalComponent,
    TagSelectComponent, DishSelectComponent, DishFilterSelectComponent],
  exports: [TagBrowseComponent, DishFilterSelectComponent, GenerateListComponent,
    DishSelectComponent, TagSelectComponent, TagBrowseStyleDirective,
    ModalComponent]
})
export class AppCommonModule {
}
