import {Tag} from "./tag";
import {ProposalDish} from "./proposal-dish";
export interface ProposalSlot {
  slot_id: string;
  slot_dish_tag: Tag;
  tags: Tag[];
  dish_slot_list: ProposalDish[];
  slot_order: number;
  selected_dish_index: number;
}


