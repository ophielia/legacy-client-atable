import {NgModule} from "@angular/core";
import {TagCommService} from "./tag-drilldown-select.service";
import {TagDrilldownComponent} from "./tag-drilldown.component";
import {TagDrilldownContainer} from "./tag-drilldown-container";
import {FormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {routing} from "../../app.routes";
import {TagsService} from "../../services/tags.service";
import {CommonModule} from "@angular/common";
import {Angular2FontawesomeModule} from "angular2-fontawesome";

@NgModule({
  declarations: [
    TagDrilldownComponent,
    TagDrilldownContainer
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpModule,
    routing,
    Angular2FontawesomeModule
  ],
  exports: [TagDrilldownContainer],
  providers: [TagsService, TagCommService]
})
export class DrilldownModule {
}



