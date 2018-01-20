import {TargetSlot} from "./target-slot";
import {Tag} from "./tag";
export interface Target {
  created: number;
  target_tags: Tag[];
  target_id: string;
  user_id: string;
  proposal_id: string;
  target_name: string;
  last_used: number;
  target_slots: TargetSlot[];
}


