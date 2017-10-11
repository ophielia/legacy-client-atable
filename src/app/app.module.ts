import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormBuilder, FormsModule} from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { PocTagListComponent } from './poc-tag-list/tag-list.component';
import {MockTagsService} from "./mock-tags.service";
import { TagDetailsComponent } from './tag-details/tag-details.component';
import {routing} from "./app.routes";
import {PocAddTagComponent} from "./poc-tag-list/add-tag.component";
import { PocEditTagComponent } from './poc-tag-list/edit-tag.component';
import {PocDeleteTagComponent} from "./poc-tag-list/delete-tag.component";
import {HomeComponent} from "./home.component";
import {AuthenticationService} from "./authentication.service";
import {LoginComponent} from "./login.component";
import {TagsService} from "./tags.service";
import {TagListComponent} from "./tag-list/tag-list.component";
import { TagDrilldownComponent } from './tag-list/tag-drilldown.component';
import {DrilldownCommunicationService} from "./tag-list/tag-drilldown-select.service";

@NgModule({
  declarations: [
    AppComponent,
    PocTagListComponent,
    PocAddTagComponent,
    TagDetailsComponent,
    PocEditTagComponent,
    PocDeleteTagComponent,
    HomeComponent,
    TagListComponent,
    LoginComponent,
    TagDrilldownComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing
  ],
  providers: [MockTagsService, TagsService,AuthenticationService, DrilldownCommunicationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
