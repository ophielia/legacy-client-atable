import {Component, OnDestroy, OnInit} from '@angular/core';
import {ITag} from "../../model/tag";
import {TagCommService} from "../../legacy/drilldown/tag-drilldown-select.service";
import {Dish} from "../../model/dish";
import TagSelectType from "../../model/tag-select-type";
import {MealPlan} from "../../model/mealplan";
import {MealPlanService} from "../../services/meal-plan.service";
import {DishService} from "../../services/dish-service.service";
import {ShoppingListService} from "../../services/shopping-list.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'at-edit-meal-plan',
  templateUrl: './edit-meal-plan.component.html',
  styleUrls: ['./edit-meal-plan.component.css']
})
export class EditMealPlanComponent implements OnInit, OnDestroy {


  mealPlan: MealPlan = <MealPlan>{meal_plan_id: "", name: ""};
  sub: any;


  constructor(private mealPlanService: MealPlanService,
              private dishService: DishService,
              private shoppingListService: ShoppingListService,
              tagCommService: TagCommService,
              private route: ActivatedRoute,
              private router: Router,) {

  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      let id = params['id'];
      console.log('getting mealPlan with id: ', id);
      this.mealPlanService
        .getById(id)
        .subscribe(p => this.mealPlan = p);
    });

  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  generateShoppingList() {
    this.shoppingListService.generateShoppingList(this.mealPlan.meal_plan_id)
      .subscribe(r => {
        var headers = r.headers;
        var location = headers.get("Location");
        var splitlocation = location.split("/");
        var id = splitlocation[splitlocation.length - 1];
        //    this.getAllDishes();
        this.router.navigate(['/list/edit/', id]);
      });
  }

}
