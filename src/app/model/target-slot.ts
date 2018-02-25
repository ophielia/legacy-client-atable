import {ITag} from "./tag";
export interface TargetSlot {
  target_slot_id: string;
  slot_dish_tag_id: string;
  slot_dish_tag: ITag;
  slot_tags: ITag[];
  slot_order: number;
}

