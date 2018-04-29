import {NgModule} from '@angular/core';
import {TagBrowseComponent} from "./tag-browse/tag-browse.component";
import {TagBrowseNodeComponent} from './tag-browse/tag-browse-node.component';
import {BrowserModule} from "@angular/platform-browser";
import {CommonModule} from "@angular/common";
import {TagsService} from "../services/tags.service";
import {TagCommService} from "../legacy/drilldown/tag-drilldown-select.service";
import {Angular2FontawesomeModule} from "angular2-fontawesome";
import {commonRouting} from "./common.routes";
import {TagBrowseStyleDirective} from './tag-browse-style.directive';
import {TagSelectComponent} from './tag-select/tag-select.component';
import {AutoCompleteModule} from "primeng/primeng";
import {HttpModule} from "@angular/http";
import {FormsModule} from "@angular/forms";
import {ModalComponent} from "./modal/modal";
import {DishSelectComponent} from './dish-select/dish-select.component';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    Angular2FontawesomeModule,
    AutoCompleteModule,
    commonRouting
  ],
  providers: [TagsService, TagCommService],
  declarations: [TagBrowseComponent, TagBrowseNodeComponent, TagBrowseStyleDirective, ModalComponent, TagSelectComponent, DishSelectComponent],
  exports: [TagBrowseComponent, DishSelectComponent, TagSelectComponent, TagBrowseStyleDirective, ModalComponent]
})
export class AppCommonModule {
}
