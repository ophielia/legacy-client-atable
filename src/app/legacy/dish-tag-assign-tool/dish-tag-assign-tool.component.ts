import {Component, OnDestroy, OnInit} from "@angular/core";
import {TagCommService} from "../drilldown/tag-drilldown-select.service";
import {ActivatedRoute, Router} from "@angular/router";
import {DishService} from "../../services/dish-service.service";
import {Dish} from "../../model/dish";
import {Tag} from "../../model/tag";
import {TagsService} from "../../services/tags.service";
import TagSelectType from "../../model/tag-select-type";

@Component({
  selector: 'at-dish-tag-assign-tool',
  templateUrl: './dish-tag-assign-tool.component.html',
  styleUrls: ['./dish-tag-assign-tool.component.css']
})
export class DishTagAssignToolComponent implements OnInit, OnDestroy {
  withTag: Dish[];
  errorMessage: any;
  dishPool: Dish[];
  currentTag: any;
  tagCommService: TagCommService;
  selectType: string = TagSelectType.Assign;
  private subTagEvent: any;
  private _dishService: DishService;
  private tagService: TagsService;
  loading: boolean = false;

  constructor(dishService: DishService,
              tagService: TagsService,
              tagCommService: TagCommService,
              private route: ActivatedRoute,
              private router: Router) {
    this._dishService = dishService;
    this.tagCommService = tagCommService;
    this.tagService = tagService;
  }

  ngOnInit() {
    this.getAllDishes();
    this.subTagEvent = this.tagCommService.selectEvent
      .subscribe(selectevent => {

        this.setCurrentTag(selectevent);
      });
  }

  ngOnDestroy() {
    this.subTagEvent.unsubscribe();
  }

  getAllDishes() {
    this.loading = true;
    this.dishPool = [];
    this.withTag = [];
    if (this.currentTag) {
      var inclList: string[] = [this.currentTag.tag_id];
      var exclList: string[] = [this.currentTag.tag_id];
      this._dishService.findByTags(inclList, null)
        .subscribe(p => {
          this.withTag = p;
          this._dishService.findByTags(null, exclList)
            .subscribe(t => {
              this.dishPool = t;
              this.loading = false;
            })
        });
    } else {
      this._dishService
        .getAll()
        .subscribe(p => {
            this.dishPool = p;
            this.loading = false;


          },
          e => this.errorMessage = e);
    }

  }

  clearCurrentTag() {
    this.currentTag = null;
    this.getAllDishes();
  }

  setCurrentTag(tag: Tag) {
    this.currentTag = tag;
    this.getAllDishes();
  }

  addTagToDish(dish_id: string) {
    // add dish in back end
    this._dishService.addTagToDish(dish_id, this.currentTag.tag_id)
      .subscribe(e => {
        this.getAllDishes();
      });
    return false;
  }

  deleteTagFromDish(dish_id: string) {
    // add dish in back end
    this._dishService.removeTagFromDish(dish_id, this.currentTag.tag_id)
      .subscribe(e => {
        this.getAllDishes();
      });
    return false;
  }
}
