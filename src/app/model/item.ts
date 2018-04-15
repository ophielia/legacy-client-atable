import {ITag} from "./tag";
import {IItemSource} from "./item-source";
export interface IItem {
  list_id: string;
  item_id: string;
  dish_sources: IItemSource[];
  list_sources: IItemSource[];
  added: number;
  free_text: string;
  crossed_off: number;
  tag_id: string;
  used_count: number;
  tag: ITag;
}

export class Item implements IItem {
  constructor() {
  }

  list_id: string;
  item_id: string;
  dish_sources: IItemSource[];
  list_sources: IItemSource[];
  added: number;
  free_text: string;
  crossed_off: number;
  tag_id: string;
  used_count: number;
  tag: ITag;
}
