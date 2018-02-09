import {Dish} from "./dish";
export interface Tag {
  tag_id: string;
  name: string;
  description: string;
  tag_type: string;
  power: number;
  dishes: Dish[],
  assign_select: boolean;
  search_select: boolean;
  is_inverted: boolean;
}
