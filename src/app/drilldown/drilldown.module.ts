import {NgModule} from "@angular/core";
import {DrilldownCommService} from "./tag-drilldown-select.service";
import {TagDrilldownComponent} from "./tag-drilldown.component";
import {TagDrilldownContainer} from "./tag-drilldown-container";
import {FormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {routing} from "../app.routes";
import {TagsService} from "../tags.service";
import {CommonModule} from "@angular/common";

@NgModule({
  declarations: [
    TagDrilldownComponent,
    TagDrilldownContainer
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpModule,
    routing
  ],
  exports: [TagDrilldownContainer],
  providers: [TagsService, DrilldownCommService]
})
export class DrilldownModule {
}



