import {Slot} from "./slot";
export interface MealPlan {
  meal_plan_id: string;
  user_id: string;
  name: string;
  created: Date;
  meal_plan_type: string;
  slots: Slot[];
}


