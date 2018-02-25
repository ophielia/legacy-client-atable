import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {Dish} from "../../model/dish";
import {DishService} from "../../services/dish-service.service";
import TagType from "../../model/tag-type";
import {TagsService} from "../../services/tags.service";
import {Tag} from "../../model/tag";
import {RatingTag} from "../rating-tag";

@Component({
  selector: 'at-add-dish-rating',
  templateUrl: './add-dish-rating.component.html',
  styleUrls: ['./add-dish-rating.component.css']
})
export class AddDishRatingComponent implements OnInit {
  ratingTags: any[];

  dishId: string;
  dish: Dish;
  ratingDictionary: any;
  private ratingTagMax: any = [];

  constructor(private route: ActivatedRoute,
              private router: Router,
              private dishService: DishService,
              private tagService: TagsService,) {
    this.dishId = this.route.snapshot.params['id'];


  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      let id = params['id'];
      console.log('getting dish with id: ', id);
      this.getDishAndRatingTags(id);
    });
  }


  getDishAndRatingTags(id: string) {
    this.dishService
      .getById(id)
      .subscribe(p => {
        this.dish = p;
        this.tagService.getAllSelectableFilled(TagType.Rating)
          .subscribe(t => this.processDishAndTags(t));
      });
  }

  processDishAndTags(tagList: Tag[]) {
    let tmpRatingDictionary: any = [];
    let tmpDishRatings: any = [];

    // push dish tags into (temporary) hash
    if (this.dish.tags) {
      this.dish.tags.filter(t => t.tag_type == TagType.Rating
      && t.parent_id)
        .forEach(t => tmpDishRatings[t.tag_id] = new RatingTag(t, 0));
    }

    // put raw list into dictionary with
    // parent id as key, and list of sorted tags as values
    for (var i = 0; i < tagList.length; i++) {
      let key = tagList[i].parent_id;
      let valueList: Tag[] = tmpRatingDictionary[key];
      if (!valueList) {
        valueList = [];
      }
      valueList.push(tagList[i]);
      tmpRatingDictionary[key] = valueList;
    }

    // sort the dictionary
    Object.keys(tmpRatingDictionary).forEach(
      key => {
        let arr = tmpRatingDictionary[key];
        arr.sort((v1: Tag, v2: Tag) => {
          if (v1.power > v2.power) {
            return 1;
          }

          if (v1.power < v2.power) {
            return -1;
          }

          return 0;
        });
        this.ratingTagMax[key] = arr.length;
        for (var i = 0; i < arr.length; i++) {
          let cmpKey = arr[i].tag_id;
          if (cmpKey in tmpDishRatings) {
            tmpDishRatings[cmpKey].idx = i;
            tmpDishRatings[cmpKey].parent_id = arr[i].parent_id;

          }
        }
      });


    // dump values of tmpDishRatings into simple array
    let tmpRatingTags = [];

    Object.keys(tmpDishRatings).forEach(
      key => tmpRatingTags.push(tmpDishRatings[key])
    );


    this.ratingTags = tmpRatingTags.sort((a: Tag, b: Tag) => {
      return a.name.toUpperCase().localeCompare(b.name.toUpperCase());
    });
    this.ratingDictionary = tmpRatingDictionary;


  }

  incrementUp(tag: RatingTag) {
    this.assignTag(tag, 1);
  }

  incrementDown(tag: RatingTag) {
    this.assignTag(tag, -1);
  }

  goToNext() {
    this.router.navigate(['/adddish/ingredients/', this.dishId]);
  }

  assignTag(tag: RatingTag, inc: number) {
    let newIndex = tag.idx + inc;
    let arr = this.ratingDictionary[tag.parent_id];
    let tagToAssign = arr[newIndex];
    this.dishService.addTagToDish(this.dish.dish_id, tagToAssign.tag_id)
      .subscribe(t => this.getDishAndRatingTags(this.dish.dish_id));
  }
}
