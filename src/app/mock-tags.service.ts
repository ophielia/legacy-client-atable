import {Injectable} from "@angular/core";
import {Tag} from "./model/tag";
import TType from "./model/tag-type";

const TAGS: Tag[] = [
  {
    tag_id: "1",
    name: 'carrot',
    description: 'orange',
    tag_type: TType.TagType,
    assign_select: false,
    search_select: false,
    is_inverted: false
  },
  {
    tag_id: "2",
    name: 'easy',
    description: 'easy to make',
    tag_type: TType.TagType,
    assign_select: false,
    search_select: false,
    is_inverted: false
  },
  {
    tag_id: "3",
    name: 'cheap',
    description: 'not expensive',
    tag_type: TType.TagType,
    assign_select: false,
    search_select: false,
    is_inverted: false
  }
];

@Injectable()
export class MockTagsService {

  private tags = TAGS.slice(0);

  constructor() {
  }

  getAllTags(): Tag[] {
    return this.tags;
  }

  getById(tag_id: string): Tag {
    return this.tags.find(p => p.tag_id === tag_id);
  }

  addTag(newTag: Tag) {
    alert(newTag.name);
    // just for now
    newTag.tag_id = this.tags.length > 0 ?
      this.tags.map(s => s.tag_id)
        .reduce((p, c) => p < c ? c : p) + 1  + "": "1";
    this.tags.push(newTag);
  }

  saveTag(tag : Tag) {
    let oldTag = this.tags.filter(s => s.tag_id == tag.tag_id)[0];
    if (oldTag) {
      oldTag.name = tag.name;
      oldTag.description = tag.description;
    }
  }

    deleteTag(id: string) {
      let oldTag = this.tags.filter(s => s.tag_id == id)[0];
      if (oldTag) {
        let tagIndex = this.tags.indexOf(oldTag);
        if (tagIndex >= 0) {
          this.tags.splice(tagIndex,1);
        }
      }
    }

}
