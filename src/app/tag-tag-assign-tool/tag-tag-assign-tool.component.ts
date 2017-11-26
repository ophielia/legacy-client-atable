import {Component, OnDestroy, OnInit} from '@angular/core';
import {Tag} from "../model/tag";
import {ListLayoutCategory} from "../model/listcategory";
import {ListLayout} from "../model/listlayout";
import {ListLayoutService} from "../list-layout.service";
import {TagsService} from "../tags.service";
import {ActivatedRoute, Router} from "@angular/router";
import TagType from "../model/tag-type";
import {TagDrilldown} from "../model/tag-drilldown";
import {TagCommService} from "../drilldown/tag-drilldown-select.service";

@Component({
  selector: 'at-tag-tag-assign-tool',
  templateUrl: './tag-tag-assign-tool.component.html',
  styleUrls: ['./tag-tag-assign-tool.component.css']
})
export class TagTagAssignToolComponent implements OnInit, OnDestroy {
  hopperTags: TagDrilldown[];
  showToRemove: boolean = false;
  currentTagType: string = TagType.Rating;
  tagTypeList: string[] = TagType.listAll();
  selectedTag: Tag;
  parentTags: Tag[];
  private showToAdd: boolean = false;
  private subTagEvent: any;
  private createNewGroupFlag: boolean = false;


  tagsToRemove: Tag[];
  categoryTags: Tag[];
  tagsToAdd: Tag[];
  private editTagList: TagDrilldown[];
  private errorMessage: string;
  private loading: boolean = false;

  private layoutId: string;
  private listLayout: ListLayout;
  private addLocked: boolean = true;
  private deleteLocked: boolean = true;

  constructor(private listLayoutService: ListLayoutService,
              private tagCommService: TagCommService,
              private tagService: TagsService,
              private route: ActivatedRoute,
              private router: Router,) {
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


  selectAssignTag(tag: Tag) {
    this.selectedTag = tag;
    this.addLocked = false;
  }


  clearAllTagsToAdd() {
    this.hopperTags = [];
    this.showToAdd = false;
  }

  addAllTagsToSelected() {
    this.showToAdd = false;
    this.loading = true;
    this.tagService
      .assignTagsToTag(this.selectedTag.tag_id, this.hopperTags)
      .subscribe(r => {
        this.retrieveTagDrilldown();
        this.retrieveParentTags();
      });
    this.hopperTags = [];
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
      this.tagService.assignTagsToTag(id, tagsToAdd)
        .subscribe(r => {
          this.retrieveParentTags();
          this.retrieveTagDrilldown();
        })
      ;
    });

  }

  selectTagToAdd(tag: Tag) {
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

  removeFromTagsToAdd(tag: Tag) {
    this.hopperTags = this.hopperTags
      .filter(p => p !== tag);
    if (this.tagsToAdd.length == 0) {
      this.showToAdd = false;
    }
  }

  clearAllTagsToRemove() {
    this.categoryTags = this.categoryTags.concat(this.tagsToRemove);
    this.tagsToRemove = [];
    this.showToRemove = false;
  }


  private retrieveCategoryTags(category_id: string) {

    this.tagService
      .getTagsForLayoutCategory(this.listLayout.layout_id, category_id)
      .subscribe(p => this.categoryTags = p);
  }
}
