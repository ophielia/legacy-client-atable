import {Dish} from "./dish";
export interface Slot {
  slot_id: string;
  dish: Dish;
  //MM dont need this i think meal_plan_id: string;
}
