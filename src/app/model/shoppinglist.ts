import {Category} from "./category";
import {IItemSource} from "./item-source";
export interface IShoppingList {
  list_id: string;
  categories: Category[];
  user_id: string;
  created: number;
  updated: number;
  list_type: string;
  layout_type: string;
  item_count: number;
  dish_sources: IItemSource[];
  list_sources: IItemSource[];
}

export class ShoppingList implements IShoppingList {
  constructor() {
  }

  list_id: string;
  categories: Category[];
  user_id: string;
  created: number;
  updated: number;
  list_type: string;
  layout_type: string;
  item_count: number;
  dish_sources: IItemSource[];
  list_sources: IItemSource[];
}

