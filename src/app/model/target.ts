import {TargetSlot} from "./target-slot";
import {ITag} from "./tag";
export interface Target {
  created: number;
  target_tags: ITag[];
  target_id: string;
  user_id: string;
  proposal_id: string;
  target_name: string;
  last_used: number;
  target_slots: TargetSlot[];
}


