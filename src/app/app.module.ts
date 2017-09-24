import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { TagListComponent } from './tag-list/tag-list.component';
import {TagsService} from "./tags.service";
import { TagDetailsComponent } from './tag-details/tag-details.component';

@NgModule({
  declarations: [
    AppComponent,
    TagListComponent,
    TagDetailsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [TagsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
