import {IItem, Item} from "./item";
export interface ICategory {
  override_class: string ;
  name: string;
  items: Item[];
  subcategories: ICategory[];
  is_frequent: boolean;

  allItems(): IItem[]
}


export class Category implements ICategory {
  constructor(
    public name: string,
    public items: Item[],
    public  subcategories: Category[],
    public  override_class: string,
    public  is_frequent: boolean,
) {}

  allItems(): IItem[] {
    var allitems = [];
    allitems = allitems.concat(this.items);
    for (let cat of this.subcategories) {
      allitems = allitems.concat(cat.allItems());
    }
    return allitems;
  }


}

