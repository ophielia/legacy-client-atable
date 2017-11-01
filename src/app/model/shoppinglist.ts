import {Category} from "./category";
export interface ShoppingList {
  list_id: string;
  categories: Category[];
  user_id: string;
  created: number;
  list_type: string;
  layout_type: string;
}


