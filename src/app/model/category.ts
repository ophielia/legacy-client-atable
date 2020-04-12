import {IItem, Item} from "./item";
export interface ICategory {
  override_class: string ;
  name: string;
  items: Item[];
  subcategories: ICategory[];
  category_type: string;
  is_frequent: boolean;
  dish_id: string;

  allItems(): IItem[]
}


export class Category implements ICategory {
  constructor(
    public name: string,
    public items: Item[],
    public  subcategories: Category[],
    public  category_type: string,
    public  override_class: string,
    public  is_frequent: boolean,
    public   dish_id: string
) {}

  allItems(): IItem[] {
    return this.items;
  }


}

