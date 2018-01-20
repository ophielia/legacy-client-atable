import {Tag} from "./tag";
import {Dish} from "./dish";
export interface ProposalDish {
  dish: Dish;
  matched_tags: Tag[];
  selected: boolean ;
}


