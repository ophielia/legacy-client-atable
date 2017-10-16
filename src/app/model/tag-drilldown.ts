import {Tag} from "./tag";
export interface TagDrilldown extends Tag {
  tag_id: string;
  name: string;
  description: string;
  parent_id: string;
  children_ids: string[];
  children: TagDrilldown[];
  expanded: boolean;
  level: number;
}

