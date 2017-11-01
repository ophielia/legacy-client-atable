import {Component, OnInit} from '@angular/core';
import {MealPlan} from "../model/mealplan";
import {ActivatedRoute, Router} from "@angular/router";
import {MealPlanService} from "../meal-plan.service";
import {Dish} from "../model/dish";
import {Slot} from "../model/slot";
import {DishService} from "../dish-service.service";

@Component({
  selector: 'at-edit-meal-plan',
  templateUrl: './edit-meal-plan.component.html',
  styleUrls: ['./edit-meal-plan.component.css']
})
export class EditMealPlanComponent implements OnInit {

  dishList: Dish[];
  mealPlanId: string;
  name: string;
  mealPlan: MealPlan = <MealPlan>{meal_plan_id: "", name: ""};
  sub: any;
  private errorMessage: string;


  constructor(private mealPlanService: MealPlanService,
              private dishService: DishService,
              private route: ActivatedRoute,
              private router: Router,) {
    this.mealPlanId = this.route.snapshot.params['id'];
    this.dishList = [];
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      let id = params['id'];
      console.log('getting mealPlan with id: ', id);
      this.mealPlanService
        .getById(id)
        .subscribe(p => this.mealPlan = p);
    });
    this.getAllDishes();
  }

  getAllDishes() {
    this.dishService
      .getAll()
      .subscribe(p => this.dishList = p,
        e => this.errorMessage = e);
  }

  addDish(dish: Dish) {
    // add dish to mealPlan
    var dishExists = this.mealPlan.slots.filter(t => t.dish.dish_id == dish.dish_id);
    if (dishExists.length > 0) {
      // dish in mealplan - don't add again
      return;
    }
    // add dish in back end
    var slots = this.mealPlan.slots.slice(0);
    var slot: Slot = <Slot>{slot_id: "", dish: dish};
    slots.push(slot);
    this.mealPlan.slots = slots;
    this.mealPlanService.addDishToMealPlan(dish.dish_id, this.mealPlan.meal_plan_id)
      .subscribe();
    return false;
  }

  generateShoppingList() {
    this.mealPlanService.generateShoppingList(this.mealPlan.meal_plan_id)
      .subscribe(r => {
        var headers = r.headers;
        var location = headers.get("Location");
        var splitlocation = location.split("/");
        var id = splitlocation[splitlocation.length - 1];
        //    this.getAllDishes();
        this.router.navigate(['/shoppinglist/edit/', id]);
      });
  }

  goToList() {
    this.router.navigate(['/mealplan/list']);
  }

  deleteDish(dish: Dish) {
    // remove dish from mealplan
    this.mealPlan.slots = this.mealPlan.slots.filter(t => t.dish.dish_id != dish.dish_id);
    // remove tag from backend
    this.mealPlanService.removeDishFromMealPlan(dish.dish_id, this.mealPlan.meal_plan_id)
      .subscribe();
    return false;
  }

}
