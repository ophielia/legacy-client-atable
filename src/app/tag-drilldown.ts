export interface TagDrilldown {
  tag_id: string;
  name: string;
  description: string;
  parent_id: string;
  children_ids: string[];
  children: TagDrilldown[];
}

