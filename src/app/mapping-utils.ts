import {Tag} from "./model/tag";
import {Dish} from "./model/dish";
import {TagDrilldown} from "./model/tag-drilldown";
import {MealPlan} from "./model/mealplan";
import {Slot} from "./model/slot";
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

  private static _toDish(r: any): Dish {
    let dish = <Dish>({
        dish_id: r.dish_id,
        name: r.name,
        description: r.description,
        user_id: r.user_id,
        tags: r.tags.map(MappingUtils._toTag)
      })
    ;
    return dish;
  }

  private static _toSlot(r: any): Slot {
    let slot = <Slot>({
      slot_id: r.slot_id,
      dish: MappingUtils._toDish(r.dish)
    });

    console.log('Parsed tag:', slot);
    return slot;
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
    let dish = MappingUtils._toDish(r.dish);


    console.log('Parsed dish:', dish);
    return dish;
  }

  static toMealPlan(r: any): MealPlan {
    let dish = <MealPlan>({
      meal_plan_id: r.meal_plan.meal_plan_id,
      user_id: r.meal_plan.user_id,
      name: r.meal_plan.name,
      created: r.meal_plan.created,
      meal_plan_type: r.meal_plan.meal_plan_type,
      slots: r.meal_plan.slots.map(MappingUtils._toSlot)
      })
    ;

    console.log('Parsed dish:', dish);
    return dish;
  }
}
