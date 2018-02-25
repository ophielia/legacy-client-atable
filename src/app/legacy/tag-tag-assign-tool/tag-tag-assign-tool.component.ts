import {Component, OnDestroy, OnInit} from '@angular/core';
import {ITag} from "../../model/tag";
import {ListLayoutCategory} from "../../model/listcategory";
import {ListLayout} from "../../model/listlayout";
import {ListLayoutService} from "../../services/list-layout.service";
import {TagsService} from "../../services/tags.service";
import {ActivatedRoute, Router} from "@angular/router";
import TagType from "../../model/tag-type";
import {TagDrilldown} from "../../model/tag-drilldown";
import {TagCommService} from "../drilldown/tag-drilldown-select.service";
import TagSelectType from "../../model/tag-select-type";

@Component({
  selector: 'at-tag-tag-assign-tool',
  templateUrl: './tag-tag-assign-tool.component.html',
  styleUrls: ['./tag-tag-assign-tool.component.css']
})
export class TagTagAssignToolComponent implements OnInit, OnDestroy {
  hopperTags: ITag[];
  showToRemove: boolean = false;
  doShowAddTag: boolean = false;
  currentTagType: string = TagType.Rating;
  tagTypeList: string[] = TagType.listAll();
  selectedTag: ITag;
  parentTags: ITag[];
  private showToAdd: boolean = false;
  private subTagEvent: any;
  private createNewGroupFlag: boolean = false;
  currentSelectType: string = TagSelectType.All;

  tagsToRemove: ITag[];
  categoryTags: ITag[];
  tagsToAdd: ITag[];
  private editTagList: TagDrilldown[];
  private errorMessage: string;
  private loading: boolean = false;

  private layoutId: string;
  private listLayout: ListLayout;
  private addLocked: boolean = true;
  private deleteLocked: boolean = true;
  private editTag: ITag;

  constructor(private tagCommService: TagCommService,
              private tagService: TagsService,
              private route: ActivatedRoute) {
    this.layoutId = this.route.snapshot.params['id'];
  }

  ngOnInit() {
    this.subTagEvent = this.tagCommService.selectEvent
      .subscribe(selectevent => {
        this.selectEditTag(selectevent);
      })
    this.editTagList = [];
    this.categoryTags = [];
    this.retrieveTagDrilldown();
    this.retrieveParentTags();
  }

  ngOnDestroy() {
    this.subTagEvent.unsubscribe;
  }

  retrieveTagDrilldown() {
    this.editTagList = [];
    this.tagService
      .getTagDrilldownList(this.currentTagType)
      .subscribe(p => {
          this.editTagList = p;
          this.loading = false;
        },
        e => this.errorMessage = e);
  }

  retrieveParentTags() {
    this.parentTags = [];
    this.loading = false;
    this.tagService
      .getAllParentTags(this.currentTagType)
      .subscribe(p => {
          this.parentTags = p;
          this.loading = false;
        },
        e => this.errorMessage = e);
  }

  selectEditTag(tag: TagDrilldown) {
    this.showToAdd = true;
    if (!this.hopperTags) {
      this.hopperTags = [];
    }
    this.hopperTags.push(tag);
  }


  selectAssignTag(tag: ITag) {
    this.selectedTag = tag;
    this.addLocked = false;
  }


  clearAllTagsToAdd() {
    this.hopperTags = [];
    this.showToAdd = false;
    this.editTag = null;
  }

  addAllTagsToSelected() {
    this.showToAdd = false;
    this.loading = true;
    var addTags = this.hopperTags;
    this.hopperTags = [];
    this.editTagList = [];
    var listofids = addTags.map(t => t.tag_id);
    var idstring = listofids.join(",");

    this.tagService
      .assignTagsToTag(this.selectedTag.tag_id, idstring)
      .subscribe(r => {
        this.retrieveTagDrilldown();
        this.retrieveParentTags();
      });
  }

  moveToBaseTag() {
    this.showToAdd = false;
    this.loading = true;
    this.tagService
      .assignTagsToBaseTag(this.hopperTags)
      .subscribe(r => {
        this.retrieveTagDrilldown();
        this.retrieveParentTags();
      });
    this.hopperTags = [];
  }

  createNewGroup() {
    this.createNewGroupFlag = true;
  }

  changeTagType(tagtype: string) {
    this.currentTagType = tagtype;
    this.retrieveTagDrilldown();
    this.retrieveParentTags()
    this.hopperTags = [];
  }

  addTagsToNewGroup(newgroup: string) {
    this.createNewGroupFlag = false;
    var tagsToAdd = this.hopperTags;
    this.hopperTags = [];

    let $newtag = this.tagService.addTag(newgroup, this.currentTagType);

    $newtag.subscribe(r => {
      var headers = r.headers;
      var location = headers.get("Location");
      var splitlocation = location.split("/");
      var id = splitlocation[splitlocation.length - 1];
      var listofids = tagsToAdd.map(t => t.tag_id).join(",");
      this.tagService.assignTagsToTag(id, listofids)
        .subscribe(r => {
          this.retrieveParentTags();
          this.retrieveTagDrilldown();
        })
      ;
    });

  }

  selectTagToAdd(tag: ITag) {
    if (this.addLocked) {
      return;
    }
    this.deleteLocked = true;
    if (!this.tagsToAdd) {
      this.tagsToAdd = [];
    }
    this.tagsToAdd.push(tag);
    this.editTagList = this.editTagList
      .filter(p => p !== tag);
    this.showToAdd = true;
  }

  removeFromTagsToAdd(tag: ITag) {
    this.hopperTags = this.hopperTags
      .filter(p => p !== tag);
    if (this.tagsToAdd.length == 0) {
      this.showToAdd = false;
    }
  }

  editTagName(tag: ITag) {
    // set the editTag variable
    this.editTag = tag;
  }

  saveTagNameEdit(tagname: string) {
    var updateTag: ITag = this.editTag;
    this.editTag = null;
    updateTag.name = tagname;
    this.tagService.saveTag(updateTag)
      .subscribe();
    this.hopperTags.forEach(t => {
      if (t.tag_id == updateTag.tag_id) {
        t.name = updateTag.name;
      }
    })
    this.editTag == null;
  }

  showEditTag(tag_id: string) {
    if (!this.editTag) {
      return false;
    }
    if (this.editTag.tag_id == tag_id) {
      return true;
    }
    return false;
  }

  showAddTag() {
    return this.doShowAddTag;
  }

  toggleAddTag() {
    this.doShowAddTag = !this.doShowAddTag;
  }

  addNewTag(tagname: string) {
    this.tagService.addTag(tagname, this.currentTagType)
      .subscribe(r => {
        console.log(`added!!! this.tagName`);
        this.retrieveTagDrilldown();
      });
  }


}
