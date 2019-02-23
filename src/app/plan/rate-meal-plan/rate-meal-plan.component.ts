import {Component, OnInit} from '@angular/core';
import {DishService} from "../../services/dish-service.service";
import {TagCommService} from "../../legacy/drilldown/tag-drilldown-select.service";
import {ActivatedRoute, Router} from "@angular/router";
import {MealPlanService} from "../../services/meal-plan.service";
import {Subscription} from "rxjs";
import {MealPlan} from "../../model/mealplan";
import {RatingUpdateInfo} from "../../model/rating-update-info";
import {IRatingInfo, RatingInfo} from "../../model/rating-info";
import {DishRatingInfo} from "../../model/dish-rating-info";

@Component({
  selector: 'at-rate-meal-plan',
  templateUrl: './rate-meal-plan.component.html',
  styleUrls: ['./rate-meal-plan.component.css']
})
export class RateMealPlanComponent implements OnInit {
  private mealPlanId: string;
  unsubscribe: Subscription[] = [];
  private mealPlan: MealPlan;
  private ratingInfo: RatingUpdateInfo;
  private headers: IRatingInfo[];
  private dishRatingInfo: DishRatingInfo[];
  private loaded: boolean = false;

  private currentIndex = 0;
  private ratingColumnCount = 5;
  private startIndex = 0;
  private indices: number[] = [];


  constructor(private dishService: DishService,
              private tagCommService: TagCommService,
              private route: ActivatedRoute,
              private router: Router,
              private mealPlanService: MealPlanService) {
  }

  ngOnInit() {
    var $sub = this.route.params.subscribe(params => {
      let id = params['id'];
      this.mealPlanId = id;
      this.getMealPlanById();
    });
    this.unsubscribe.push($sub);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach(s => s.unsubscribe());
  }

  getMealPlanById() {
    let $sub = this.mealPlanService
      .getById(this.mealPlanId)
      .subscribe(p => {
        this.mealPlan = p;
      });
    this.unsubscribe.push($sub);
    let $ratingsSub = this.mealPlanService
      .getRatingInfoForMealPlan(this.mealPlanId)
      .subscribe(p => {
        this.ratingInfo = p;
        this.headers = p.headers;
        this.dishRatingInfo = p.dish_ratings;
        this.initiateIndices();
        this.loaded = true;
      });
    this.unsubscribe.push($ratingsSub);
  }

  initiateIndices() {
    this.indices = [];
    for (var i = 0; i < this.ratingColumnCount; i++) {
      this.indices[i] = this.getWrappedIndex(this.startIndex + i)
    }
  }

  getWrappedIndex(index: number) {
    if (index < 0) {
      return index + this.headers.length;
    }
    if (index < this.headers.length) {
      return index;
    }
    return index - this.headers.length;
  }

  shiftRatingsLeft() {
    this.startIndex = this.getWrappedIndex(this.startIndex - 1);
    this.initiateIndices();
  }

  shiftRatingsRight() {
    this.startIndex = this.getWrappedIndex(this.startIndex + 1);
    this.initiateIndices();
  }

  incrementRatingUp(dish_id: string, ratingInfo: RatingInfo) {
    if (ratingInfo.power + 1 <= ratingInfo.max_power) {
      this.dishService.incrementDishRating(dish_id, ratingInfo.rating_tag_id, "UP").subscribe();
      ratingInfo.power = ratingInfo.power + 1;
    }
  }

  incrementRatingDown(dish_id: string, ratingInfo: RatingInfo) {
    if (ratingInfo.power - 1 > 0) {
      this.dishService.incrementDishRating(dish_id, ratingInfo.rating_tag_id, "DOWN").subscribe();
      ratingInfo.power = ratingInfo.power - 1;
    }
  }

  goToEditMealPlan() {
    this.router.navigate(['plan/edit', this.mealPlanId]);
  }
}
