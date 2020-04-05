import {Component, OnInit} from '@angular/core';
import {TagDrilldown} from "../../model/tag-drilldown";
import {ITag} from "../../model/tag";
import TagType from "../../model/tag-type";
import {TagCommService} from "../drilldown/tag-drilldown-select.service";
import {TagsService} from "../../services/tags.service";
import {ListLayoutService} from "../../services/list-layout.service";
import {DishService} from "../../services/dish-service.service";
import {DragulaService} from "ng2-dragula";
import {ActivatedRoute} from "@angular/router";
import {ListLayout} from "../../model/listlayout";
import {ListLayoutCategory} from "../../model/listcategory";

@Component({
  selector: 'at-layout-subcategory-tool',
  templateUrl: './layout-subcategory-tool.component.html',
  styleUrls: ['./layout-subcategory-tool.component.css']
})
export class LayoutSubcategoryToolComponent implements OnInit {
  private layoutId: string;
  listLayout: ListLayout;


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


  constructor(private tagCommService: TagCommService,
              private tagService: TagsService,
              private listLayoutService: ListLayoutService,
              private dishService: DishService,
              private dragulaService: DragulaService,
              private route: ActivatedRoute) {
    this.layoutId = this.route.snapshot.params['id'];
    dragulaService.setOptions('first-bag', {
      moves: function (el, source, handle, sibling) {
        var notdraggable = el.classList.contains('not-draggable');
        return !notdraggable;
      },
    });
  }

  ngOnInit() {
    this.retrieveLayout();

    this.dragulaService.drop.subscribe((value) => {
      let [bagName, item, destination, source] = value;
      this.categoryMoved(item, destination.dataset.id, source.dataset.id);
      //   item.style = "display:none;";
    });


    this.editTagList = [];
    this.categoryTags = [];

  }

  ngOnDestroy() {

  }

  private categoryMoved(item: any, dest_slot_id: string, source_slot_id: string) {
    console.log("category has been dropped:" + item.dataset.id);
    console.log("category destination:" + dest_slot_id);
    console.log("category can be dropped" + item.dataset.eligible);

    if (!item.dataset.eligible) {
      this.retrieveLayout();
    } else {
      this.listLayoutService.setParentForCategory(this.layoutId, dest_slot_id, item.dataset.id)
        .subscribe(l => {
          this.retrieveLayout()
        });
    }
    /*
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
     */

  }

  private moveUp(category: ListLayoutCategory) {
    this.listLayoutService.moveCategory(this.layoutId, category, false)
      .subscribe(l => this.retrieveLayout());
  }

  private moveDown(category: ListLayoutCategory) {
    this.listLayoutService.moveCategory(this.layoutId, category, true)
      .subscribe(l => this.retrieveLayout());

  }

  private moveOut(category: ListLayoutCategory) {
    this.listLayoutService.moveCategoryToParent(this.layoutId, category)
      .subscribe(l => this.retrieveLayout());
  }

  private refreshInPage() {
    this.retrieveLayout();
  }

  private retrieveLayout() {
    this.listLayoutService
      .getById(this.layoutId)
      .subscribe(p => this.listLayout = p);
  }
}
