import {ITag, Tag} from "../model/tag";

export interface IRatingTag extends ITag {
  idx: number;
}

export class RatingTag extends Tag implements IRatingTag {
  constructor(tag: ITag, idx) {
    super();
    this.tag_id = tag.tag_id;
    this.name = tag.name;
    this.description = tag.description;
    this.tag_type = tag.tag_type;
    this.power = tag.power;
    this.parent_id = tag.parent_id;
    this.assign_select = tag.assign_select;
    this.search_select = tag.search_select;

    this.idx = idx;
  }

  idx: number;
}
