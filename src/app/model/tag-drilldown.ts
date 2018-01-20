import {Tag} from "./tag";
export interface TagDrilldown extends Tag {
  tag_id: string;
  name: string;
  description: string;
  parent_id: string;
  children_ids: string[];
  children: TagDrilldown[];
  assign_select: boolean;
  search_select: boolean;
  expanded: boolean;
  level: number;
}

