import {Component, Inject, OnDestroy, OnInit} from "@angular/core";
import {DishService} from "../../services/dish-service.service";
import {Router} from "@angular/router";
import {ITag} from "../../model/tag";
import {TagsService} from "../../services/tags.service";
import TagType from "../../model/tag-type";
import TagSelectType from "../../model/tag-select-type";
import {Logger} from "angular2-logger/core";
import {APP_CONFIG, AppConfig} from "../../app.config";

@Component({
  selector: 'at-dashboard-add-dish',
  templateUrl: './add-dish-create.component.html',
  styleUrls: ['./add-dish-create.component.css']
})
export class AddDishCreateComponent implements OnInit, OnDestroy {
  defaultPower: number;
  dishTypes: ITag[] = [];
  dishName: string;
  defaultRatingTags: ITag[];

  constructor(private dishService: DishService,
              @Inject(APP_CONFIG) private config: AppConfig,
              private tagService: TagsService,
              private logger: Logger,
              private router: Router) {
  }

  ngOnDestroy(): void {

  }

  ngOnInit() {
    this.defaultPower = this.config.defaultRatingPower;
    // fill dish type list
    this.tagService.getAllSelectable(TagType.DishType, TagSelectType.Assign)
      .subscribe(t => this.dishTypes = t);
    // fill the default rating tags
    this.tagService.getAllSelectable(TagType.Rating, TagSelectType.Assign)
      .subscribe(t => this.fillDefaultRatingTags(t));

  }

  private fillDefaultRatingTags(tagList: ITag[]) {
    if (tagList) {
      this.defaultRatingTags = tagList.filter(t => t.power == 3);
    }
  }

  createDish(dishTypeTag: ITag) {
    this.logger.debug("Creating new dish [" + this.dishName + "] with tag [" + dishTypeTag + "]");
    // put tags in dish
    let tags: ITag[] = [];
    tags.push(dishTypeTag);
    this.defaultRatingTags.forEach(t => tags.push(t));

    this.dishService.addDish(this.dishName, tags)
      .subscribe(r => {
          var headers = r.headers;
          var location = headers.get("Location");
          var splitlocation = location.split("/");
          var id = splitlocation[splitlocation.length - 1];
          //    this.getAllDishes();
          this.router.navigate(['/adddish/ratings/', id]);
        }
      )
    ;
  }

}