import {Component, OnInit} from "@angular/core";
import {TagCommService} from "../drilldown/tag-drilldown-select.service";
import {ActivatedRoute, Router} from "@angular/router";
import {DishService} from "../dish-service.service";
import {Dish} from "../model/dish";
import {Tag} from "../model/tag";
import {TagsService} from "../tags.service";

@Component({
  selector: 'at-dish-tag-assign-tool',
  templateUrl: './dish-tag-assign-tool.component.html',
  styleUrls: ['./dish-tag-assign-tool.component.css']
})
export class DishTagAssignToolComponent implements OnInit {
  withTag: Dish[];
  withoutTag: Dish[];
  errorMessage: any;
  dishList: Dish[];
  currentTag: any;
  tagCommService: TagCommService;
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

  getAllDishes() {
    this.loading = true;
    this._dishService
      .getAll()
      .subscribe(p => {
          this.dishList = p;
          if (this.currentTag) {
            this.withoutTag = this.filterWithoutTag();
            this.withTag = this.filterWithTag();
            this.loading = false;
          }

        },
        e => this.errorMessage = e);
  }

  clearCurrentTag() {
    this.currentTag = null;
    this.withoutTag = null;
    this.withTag = null;
  }

  setCurrentTag(tag: Tag) {
    this.getAllDishes();
    this.currentTag = tag;
  }

  private filterWithTag(): Dish[] {
    return this.dishList.filter(d => d.tags.some(t => t.tag_id == this.currentTag.tag_id))
  }

  private filterWithoutTag(): Dish[] {
    return this.dishList.filter(d => d.tags.every(t => t.tag_id != this.currentTag.tag_id))
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
