import {ITag} from "./tag";
import {ProposalDish} from "./proposal-dish";
export interface ProposalSlot {
  slot_id: string;
  slot_dish_tag: ITag;
  tags: ITag[];
  dish_slot_list: ProposalDish[];
  slot_order: number;
  selected_dish_index: number;
  selected_dish_id: string;
}


