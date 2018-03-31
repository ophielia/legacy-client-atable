import {Item} from "./item";
export interface ICategory {
  name: string;
  items: Item[];
  subcategories: ICategory[];
}


export class Category implements ICategory {
  constructor() {
  }

  name: string;
  items: Item[];
  subcategories: Category[];
}

