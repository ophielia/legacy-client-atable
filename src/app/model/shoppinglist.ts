import {Category} from "./category";
export interface IShoppingList {
  list_id: string;
  categories: Category[];
  user_id: string;
  created: number;
  list_type: string;
  layout_type: string;
  item_count: number;
}

export class ShoppingList implements IShoppingList {
  constructor() {
  }

  list_id: string;
  categories: Category[];
  user_id: string;
  created: number;
  list_type: string;
  layout_type: string;
  item_count: number;
}

