import {Item} from "./item";
export interface ICategory {
  override_class: string ;
  name: string;
  items: Item[];
  subcategories: ICategory[];
  category_type: string;
  is_frequent: boolean;
  dish_id: string;
}


export class Category implements ICategory {
  constructor() {
  }

  name: string;
  items: Item[];
  subcategories: Category[];
  category_type: string;
  override_class: string;
  is_frequent: boolean;
  dish_id: string;
}

