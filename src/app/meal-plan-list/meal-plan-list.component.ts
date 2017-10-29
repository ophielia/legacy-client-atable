import {Component, OnInit} from "@angular/core";
import {MealPlanService} from "../meal-plan.service";
import {MealPlan} from "../model/mealplan";
import {Router} from "@angular/router";

@Component({
  selector: 'at-meal-plan-list',
  templateUrl: './meal-plan-list.component.html',
  styleUrls: ['./meal-plan-list.component.css']
})
export class MealPlanListComponent implements OnInit {

  private mealPlanService: MealPlanService;
  mealPlans: MealPlan[];
  errorMessage: string;
  showAdd: boolean;

  constructor(mealPlanService: MealPlanService, private router: Router) {
    this.mealPlanService = mealPlanService;
  }

  ngOnInit() {
    this.showAdd = false;
    this.getAllMealPlans();
  }

  getAllMealPlans() {
    this.mealPlanService
      .getAll()
      .subscribe(p => this.mealPlans = p,
        e => this.errorMessage = e);
  }

  showAddInput() {
    this.showAdd = true;
  }

  addMealPlan(mealPlanName: string) {
    this.mealPlanService.addMealPlan(mealPlanName)
      .subscribe(r => {
        console.log(`added!!! mealPlan`)
        var headers = r.headers;
        var location = headers.get("Location");
        var splitlocation = location.split("/");
        var id = splitlocation[splitlocation.length - 1];
        //    this.getAllDishes();
        this.router.navigate(['/mealplan/edit', id]);
      });
  }

  deleteMealPlan(mealPlanId: string) {
    this.mealPlanService.deleteMealPlan(mealPlanId)
      .subscribe(r => {
        this.getAllMealPlans();
      })
  }

}
