import {Tag} from "./tag";
export interface Dish {
  dish_id: string;
  name: string;
  description: string;
  last_added: number;
  user_id: string;
  tags: Tag[];
}
