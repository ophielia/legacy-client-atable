import {ITag} from "./tag";
import {Dish} from "./dish";
export interface ProposalDish {
  dish: Dish;
  matched_tags: ITag[];
  selected: boolean ;
}


