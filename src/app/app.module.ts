import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";

import {AppComponent} from "./app.component";
import {routing} from "./app.routes";
import {LegacyModule} from "app/legacy/legacy.module";


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing,
    LegacyModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
