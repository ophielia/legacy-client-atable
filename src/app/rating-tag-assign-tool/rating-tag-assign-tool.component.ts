import {Component, OnInit} from '@angular/core';
import {Tag} from "../model/tag";
import TagType from "../model/tag-type";
import TagSelectType from "../model/tag-select-type";
import {TagDrilldown} from "../model/tag-drilldown";
import {ListLayout} from "../model/listlayout";
import {TagCommService} from "../drilldown/tag-drilldown-select.service";
import {TagsService} from "../tags.service";
import {ActivatedRoute} from "@angular/router";
import {DragulaService} from "ng2-dragula";
import {DishService} from "../dish-service.service";

@Component({
  selector: 'at-rating-tag-assign-tool',
  templateUrl: './rating-tag-assign-tool.component.html',
  styleUrls: ['./rating-tag-assign-tool.component.css']
})
export class RatingTagAssignToolComponent implements OnInit {
  ratingSubTags: any[];

  ratingTags: Tag[];
  selectedRatingId: number;

  hopperTags: Tag[];
  showToRemove: boolean = false;
  doShowAddTag: boolean = false;
  currentTagType: string = TagType.Rating;
  tagTypeList: string[] = TagType.listAll();
  selectedTag: Tag;
  parentTags: Tag[];
  private showToAdd: boolean = false;
  private subTagEvent: any;
  private createNewGroupFlag: boolean = false;
  currentSelectType: string = TagSelectType.All;

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
  private editTag: Tag;

  constructor(private tagCommService: TagCommService,
              private tagService: TagsService,
              private dishService: DishService,
              private dragulaService: DragulaService,
              private route: ActivatedRoute) {
    this.layoutId = this.route.snapshot.params['id'];
  }

  ngOnInit() {
    this.subTagEvent = this.tagCommService.selectEvent
      .subscribe(selectevent => {
        this.selectEditTag(selectevent);
      })
    this.retrieveRatingTags();
    this.dragulaService.drop.subscribe((value) => {
      let [bagName, item, destination, source] = value;
      this.tagMoved(item, destination.dataset.id, source.dataset.id);
      item.style = "display:none;";
    });


    this.editTagList = [];
    this.categoryTags = [];
    this.retrieveTagDrilldown();
    this.retrieveParentTags();
  }

  ngOnDestroy() {
    this.subTagEvent.unsubscribe;
  }

  retrieveRatingTags() {
    this.ratingTags = [];
    this.loading = false;
    this.tagService
      .getAllParentTags(TagType.Rating)
      .subscribe(p => {
          this.ratingTags = p;
          this.loading = false;
        },
        e => this.errorMessage = e);
  }

  selectRatingType(id: number) {
    this.selectedRatingId = id;
    this.retrieveRatingInfo();
  }

  retrieveRatingInfo() {
    this.ratingSubTags = [];
    this.tagService
      .getDishesForRatingTags(this.selectedRatingId)
      .subscribe(t => this.ratingSubTags = t);
  }


  private tagMoved(item: any, dest_slot_id: string, source_slot_id: string) {
    console.log("tag has been dropped" + item.dataset.id);
    console.log("tag has been dropped" + item.dataset.isTag);
    console.log("tag has been dropped" + dest_slot_id);

    if (item.dataset.isTag && item.dataset.isTag == 'true') {
      let fromTagId = item.dataset.id != "null" ? item.dataset.id : 0;
      console.log("tag " + fromTagId + " to be moved to " + dest_slot_id);
      this.tagService.replaceTagsInDishes(fromTagId, dest_slot_id)
        .subscribe(t => this.retrieveRatingInfo());
    } else {
      console.log("dish " + item.dataset.id + " to be moved to " + dest_slot_id);
      this.dishService.addTagToDish(item.dataset.id, dest_slot_id)
        .subscribe(t => this.retrieveRatingInfo());
    }
    /*if (!dest_slot_id) {
     // slot to target move
     // moveTagToTarget()
     this.target.target_tags = null;
     this.targetService.moveTagToTarget(this.targetId, tag_id, source_slot_id)
     .subscribe();
     //.subscribe(p=> {this.refreshTarget(this.targetId)});
     } else {
     // target to slot move or slot to slot move
     this.targetService.moveTagToTargetSlot(this.targetId, tag_id, source_slot_id, dest_slot_id)
     .subscribe();
     //.subscribe(p=> {this.refreshTarget(this.targetId)});
     }*/

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

  editTagName(tag: Tag) {
    // set the editTag variable
    this.editTag = tag;
  }

  saveTagNameEdit(tagname: string) {
    var updateTag: Tag = this.editTag;
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
