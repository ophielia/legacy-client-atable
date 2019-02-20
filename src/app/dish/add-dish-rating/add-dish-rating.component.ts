import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {Dish} from "../../model/dish";
import {DishService} from "../../services/dish-service.service";
import {IRatingUpdateInfo} from "../../model/rating-update-info";
import {IRatingInfo, RatingInfo} from "../../model/rating-info";

@Component({
  selector: 'at-add-dish-rating',
  templateUrl: './add-dish-rating.component.html',
  styleUrls: ['./add-dish-rating.component.css']
})
export class AddDishRatingComponent implements OnInit {

  dishId: string;
  dish: Dish;
  ratingUpdateInfo: IRatingUpdateInfo;
  ratings: IRatingInfo[];

  constructor(private route: ActivatedRoute,
              private router: Router,
              private dishService: DishService) {
    this.dishId = this.route.snapshot.params['id'];


  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      let id = params['id'];
      console.log('getting dish with id: ', id);
      this.getDishAndRatingInfo(id);
    });
  }


  getDishAndRatingInfo(id: string) {
    this.dishService
      .getById(id)
      .subscribe(p => {
        this.dish = p;
      });
    this.dishService
      .getRatingInfoForDish(id)
      .subscribe(p => {
        this.ratingUpdateInfo = p;
        this.ratings = p.dish_ratings[0].ratings;
      });
  }

  incrementUp(ratingInfo: RatingInfo) {
    if (ratingInfo.power + 1 <= ratingInfo.max_power) {
      this.dishService.incrementDishRating(this.dish.dish_id, ratingInfo.rating_tag_id, "UP").subscribe();
      ratingInfo.power = ratingInfo.power + 1;
    }

  }

  incrementDown(ratingInfo: RatingInfo) {
    if (ratingInfo.power - 1 > 0) {
      this.dishService.incrementDishRating(this.dish.dish_id, ratingInfo.rating_tag_id, "DOWN").subscribe();
      ratingInfo.power = ratingInfo.power - 1;
    }
  }

  goToNext() {
    this.router.navigate(['/adddish/ingredients/', this.dishId]);
  }


}
