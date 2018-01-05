import {Tag} from "./tag";
import {ProposalSlot} from "./proposal-slot";
export interface Proposal {
  created: number;
  proposal_id: string;
  user_id: string;
  target_name: string;
  last_used: number;
  target_tags: Tag[];
  proposal_slots: ProposalSlot[];
}
