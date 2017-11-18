import {ListLayoutCategory} from "./listcategory";
export interface ListLayout {
  layout_id: string;
  listcategories: ListLayoutCategory[];
  list_layout_type: string;
  name: string;
}


