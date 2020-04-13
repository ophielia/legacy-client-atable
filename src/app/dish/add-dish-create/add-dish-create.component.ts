import {Component, Inject, OnDestroy, OnInit} from "@angular/core";
import {DishService} from "../../services/dish-service.service";
import {Router} from "@angular/router";
import {ITag} from "../../model/tag";
import {TagsService} from "../../services/tags.service";
import TagType from "../../model/tag-type";
import TagSelectType from "../../model/tag-select-type";
import {NGXLogger} from "ngx-logger";
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
  dishDescription: string;
  dishReference: string;
  defaultRatingTags: ITag[];

  constructor(private dishService: DishService,
              @Inject(APP_CONFIG) private config: AppConfig,
              private tagService: TagsService,
              private logger: NGXLogger,
              private router: Router) {
  }

  ngOnDestroy(): void {

  }

  ngOnInit() {
    this.defaultPower = this.config.defaultRatingPower;
    // fill dish type list
    this.tagService.getAllSelectable(TagType.DishType, TagSelectType.Assign)
      .subscribe(t => this.dishTypes = t);

  }


  createDish(dishTypeTag: ITag) {
    this.logger.debug("Creating new dish [" + this.dishName + "] with tag [" + dishTypeTag + "]");
    // put tags in dish
    let tags: ITag[] = [];

    this.dishService.addDish(this.dishName, this.dishDescription, this.dishReference, tags)
      .subscribe(r => {
          var headers = r.headers;
          var location = headers.get("Location");
          var splitlocation = location.split("/");
          var id = splitlocation[splitlocation.length - 1];
          //    this.getAllDishes();
          this.router.navigate(['/adddish/ratings/', id]);
        }, e => {
        // an error occurred....

        }
      )
    ;
  }

}
