import {Component, OnInit} from "@angular/core";
import {ITag} from "../../model/tag";
import TagType from "../../model/tag-type";
import TagSelectType from "../../model/tag-select-type";
import {TagDrilldown} from "../../model/tag-drilldown";
import {ListLayout} from "../../model/listlayout";
import {TagCommService} from "../drilldown/tag-drilldown-select.service";
import {TagsService} from "../../services/tags.service";
import {ActivatedRoute} from "@angular/router";
import {DragulaService} from "ng2-dragula";
import {DishService} from "../../services/dish-service.service";
import {ListLayoutService} from "../../services/list-layout.service";

@Component({
  selector: 'at-rating-tag-assign-tool',
  templateUrl: './rating-tag-assign-tool.component.html',
  styleUrls: ['./rating-tag-assign-tool.component.css']
})
export class RatingTagAssignToolComponent implements OnInit {
  ratingSubTags: any[];

  ratingTags: ITag[];
  selectedRatingId: number;

  hopperTags: ITag[];
  currentTagType: string = TagType.Rating;
  parentTags: ITag[];
  private showToAdd: boolean = false;
  private subTagEvent: any;

  categoryTags: ITag[];
  private editTagList: TagDrilldown[];
  private errorMessage: string;
  private loading: boolean = false;

  private layoutId: string;

  constructor(private tagService: TagsService,
              private dishService: DishService,
              private dragulaService: DragulaService,
              private route: ActivatedRoute) {
    this.layoutId = this.route.snapshot.params['id'];
  }

  ngOnInit() {
    this.dragulaService.drop.subscribe((value) => {
      let [bagName, item, destination, source] = value;
      this.tagMoved(item, destination.dataset.id, source.dataset.id);
      item.style = "display:none;";
    });


    this.editTagList = [];
    this.categoryTags = [];

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


}
