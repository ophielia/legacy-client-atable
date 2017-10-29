import {Component, OnInit} from '@angular/core';
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

  constructor(mealPlanService: MealPlanService, private router: Router) {
    this.mealPlanService = mealPlanService;
  }

  ngOnInit() {
    this.mealPlanService
      .getAll()
      .subscribe(p => this.mealPlans = p,
        e => this.errorMessage = e);
  }

  edit(mealPlanId: string) {
  }

  delete(mealPlanId: string) {
  }

}
