import {ITag} from "./tag";
import {IItemSource} from "./item-source";
export interface IItem {
  list_id: string;
  item_id: string;
  source_keys: string[];
  added: number;
  free_text: string;
  crossed_off: boolean;
  crossed_off_ts: number;
  tag_id: string;
  used_count: number;
  tag: ITag;
}

export class Item implements IItem {
  constructor() {
  }

  list_id: string;
  item_id: string;
  source_keys: string[];
  added: number;
  free_text: string;
  crossed_off: boolean;
  crossed_off_ts: number;
  tag_id: string;
  used_count: number;
  tag: ITag;
}
