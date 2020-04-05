import {Component, OnDestroy, OnInit} from '@angular/core';
import {MealPlanService} from "../../services/meal-plan.service";
import {ShoppingListService} from "../../services/shopping-list.service";
import {Router} from "@angular/router";
import {Subscription} from "rxjs/Subscription";
import {MealPlan} from "../../model/mealplan";

@Component({
  selector: 'at-manage-plans',
  templateUrl: './manage-plans.component.html',
  styleUrls: ['./manage-plans.component.css']
})
export class ManagePlansComponent implements OnInit, OnDestroy {
  errorMessage: any;
  public mealPlans: MealPlan[];

  unsubscribe: Subscription[] = [];

  constructor(private mealPlanService: MealPlanService,
              private shoppingListService: ShoppingListService,
              private router: Router) {
  }

  ngOnInit() {
    this.getAllMealPlans();
  }

  ngOnDestroy() {
    this.unsubscribe.forEach(s => s.unsubscribe());
  }

  getAllMealPlans() {
    var $sub = this.mealPlanService
      .getAll()
      .subscribe(p => this.mealPlans = p,
        e => this.errorMessage = e);
    this.unsubscribe.push($sub);
  }

  addPlan() {
    this.mealPlanService.addMealPlan('')
      .subscribe(r => {
        var headers = r.headers;
        var location = headers.get("Location");
        var splitlocation = location.split("/");
        var id = splitlocation[splitlocation.length - 1];
        //    this.getAllDishes();
        this.router.navigate(['/plan/edit', id]);
      });
  }

  editPlan(meal_plan_id: string) {

    this.router.navigate(['/plan/edit', meal_plan_id]);
  }

  deletePlan(meal_plan_id: string) {
    this.mealPlanService.deleteMealPlan(meal_plan_id)
      .subscribe(r => {
        this.getAllMealPlans();
      })
  }


}
