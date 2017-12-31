import {Tag} from "./tag";
export interface TargetSlot {
  target_slot_id: string;
  slot_dish_tag_id: string;
  slot_dish_tag: Tag;
  slot_tags: Tag[];
  slot_order: number;
}

