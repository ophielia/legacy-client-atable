import {Tag} from "./tag";
export interface Item {
  list_id: string;
  item_id: string;
  item_source: string;
  added: number;
  free_text: string;
  crossed_off: number;
  tag_id: string;
  tag: Tag;
}

