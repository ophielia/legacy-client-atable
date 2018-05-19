import {Component, OnInit} from "@angular/core";
import {ITag} from "../../model/tag";
import {Dish} from "../../model/dish";
import TagSelectType from "../../model/tag-select-type";
import {Subscription} from "rxjs/Subscription";
import {DishService} from "../../services/dish-service.service";
import {TagCommService} from "../../legacy/drilldown/tag-drilldown-select.service";
import {MealPlanService} from "../../services/meal-plan.service";
import {MealPlan} from "../../model/mealplan";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'at-add-to-meal-plan',
  templateUrl: './add-to-meal-plan.component.html',
  styleUrls: ['./add-to-meal-plan.component.css']
})
export class AddToMealPlanComponent implements OnInit {

  mealPlan: MealPlan;
  private mealPlanId: string;
  private mealPlanDishes: Dish[] = [];
  filterTags: ITag[];
  tagSelectEvent: any;
  selectType: string = TagSelectType.Search;
  private showSelectedMenu: boolean = false;
  unsubscribe: Subscription[] = [];

  constructor(private dishService: DishService,
              private tagCommService: TagCommService,
              private route: ActivatedRoute,
              private router: Router,
              private mealPlanService: MealPlanService) {
    this.tagCommService = tagCommService;
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
    var $sub = this.mealPlanService
      .getById(this.mealPlanId)
      .subscribe(p => {
        this.mealPlan = p;
        this.slotsToDishes();
      });
    this.unsubscribe.push($sub);
  }

  slotsToDishes() {
    this.mealPlanDishes = [];
    if (this.mealPlan.slots && this.mealPlan.slots.length > 0) {

      this.mealPlan.slots.forEach(s => {
        this.mealPlanDishes.push(s.dish);
      })
    }
  }

  unSelectDish(dish: Dish) {
    this.mealPlanDishes = this.mealPlanDishes.filter(t => dish.dish_id != t.dish_id);
    this.mealPlanService.removeDishFromMealPlan(dish.dish_id, this.mealPlanId)
      .subscribe();
  }

  goToEdit() {
    this.router.navigate(["plan/edit/", this.mealPlanId]);
  }


  selectDish(dish: Dish) {
    let match = this.mealPlanDishes.filter(t => dish.dish_id == t.dish_id);
    if (!match || match.length == 0) {
      this.mealPlanDishes.push(dish);
      this.mealPlanService.addDishToMealPlan(dish.dish_id, this.mealPlanId)
        .subscribe();
    }
  }


}
