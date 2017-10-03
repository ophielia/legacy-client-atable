import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { TagListComponent } from './tag-list/tag-list.component';
import {TagsService} from "./tags.service";
import { TagDetailsComponent } from './tag-details/tag-details.component';
import {routing} from "./app.routes";
import {AddTagComponent} from "./tag-list/add-tag.component";
import { EditTagComponent } from './tag-list/edit-tag.component';
import {DeleteTagComponent} from "./tag-list/delete-tag.component";

@NgModule({
  declarations: [
    AppComponent,
    TagListComponent,
    AddTagComponent,
    TagDetailsComponent,
    EditTagComponent,
    DeleteTagComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing
  ],
  providers: [TagsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
