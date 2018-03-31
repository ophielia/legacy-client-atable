import {ITag} from "./tag";
export interface IListLayoutCategory {
  category_id: string;
  name: string;
  layout_id: string;
  tags: ITag[];
  subcategories: ListLayoutCategory[];
}

export class ListLayoutCategory implements IListLayoutCategory {
  constructor() {
  }

  category_id: string;
  name: string;
  layout_id: string;
  tags: ITag[];
  subcategories: ListLayoutCategory[];
}

