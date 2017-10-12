import {Tag} from "./model/tag";
import {Dish} from "./model/dish";
import {TagDrilldown} from "./model/tag-drilldown";
export default class MappingUtils {

  static toTag(r: any): Tag {
    let tag = <Tag>({
      tag_id: r.tag.tag_id,
      name: r.tag.name,
      description: r.tag.description,
      tag_type: r.tag.tag_type
    });

    console.log('Parsed tag:', tag);
    return tag;
  }

  private static _toTag(r: any): Tag {
    let tag = <Tag>({
      tag_id: r.tag_id,
      name: r.name,
      description: r.description,
      tag_type: r.tag_type
    });

    console.log('Parsed tag:', tag);
    return tag;
  }

  static toTagDrilldown(r: any) {
    console.log('in map drilldown');
    let drilldown = <TagDrilldown>({
      "tag_id": r.tag_id,
      "name": r.name,
      "description": r.description,
      "tag_type": r.tag_type,
      "parent_id": r.parent_id,
      "children_ids": r.children_ids,
      "expanded": false,
      "level": 1,
      "children": []
    });

    console.log('Parsed drilldown:', drilldown);
    return drilldown;
  }

  static toDish(r: any): Dish {
    let dish = <Dish>({
        dish_id: r.dish.dish_id,
        name: r.dish.name,
        description: r.dish.description,
        user_id: r.dish.user_id,
        tags: r.dish.tags.map(MappingUtils._toTag)
      })
    ;

    console.log('Parsed dish:', dish);
    return dish;
  }
}
