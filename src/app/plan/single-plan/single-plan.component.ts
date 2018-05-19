import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {MealPlan} from "../../model/mealplan";

@Component({
  selector: 'at-single-plan',
  templateUrl: './single-plan.component.html',
  styleUrls: ['./single-plan.component.css']
})
export class SinglePlanComponent implements OnInit {

  @Input() plan: MealPlan;
  @Output() edit: EventEmitter<String> = new EventEmitter<String>();
  @Output() delete: EventEmitter<String> = new EventEmitter<String>();


  constructor() {
  }

  ngOnInit() {
  }


  editPlan(meal_plan_id: string) {
    this.edit.emit(meal_plan_id);
  }

  deletePlan(meal_plan_id: string) {
    this.delete.emit(meal_plan_id);
  }
}
