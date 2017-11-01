import {Tag} from "./model/tag";
import {Dish} from "./model/dish";
import {TagDrilldown} from "./model/tag-drilldown";
import {MealPlan} from "./model/mealplan";
import {Slot} from "./model/slot";
import {Category} from "./model/category";
import {Item} from "./model/item";
import {ShoppingList} from "./model/shoppinglist";
export default class MappingUtils {

  static toTag(r: any): Tag {
    /*let tag = <Tag>({
      tag_id: r.tag.tag_id,
      name: r.tag.name,
      description: r.tag.description,
      tag_type: r.tag.tag_type
    });

     console.log('Parsed tag:', tag);*/
    return MappingUtils._toTag(r.tag);
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

  private static _toCategory(r: any): Category {
    let category = <Category>({
      name: r.name,
      items: r.items.map(MappingUtils._toItem)
    });

    console.log('Parsed category:', category);
    return category;
  }

  private static _toItem(r: any): Item {
    let item = <Item>({
      list_id: r.list_id,
      item_id: r.item_id,
      item_source: r.item_source,
      added: r.added,
      tag_id: r.tag_id,
      used_count: r.used_count,
      free_text: r.free_text,
      crossed_off: r.crossed_off,
      tag: MappingUtils._toTag(r.tag)
    });

    console.log('Parsed tag:', item);
    return item;
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
    let mealplan = <MealPlan>({
      meal_plan_id: r.meal_plan.meal_plan_id,
      user_id: r.meal_plan.user_id,
      name: r.meal_plan.name,
      created: r.meal_plan.created,
      meal_plan_type: r.meal_plan.meal_plan_type,
      slots: r.meal_plan.slots.map(MappingUtils._toSlot)
      })
    ;

    console.log('Parsed mealplan:', mealplan);
    return mealplan;
  }

  static toShoppingList(r: any): ShoppingList {
    let shoppinglist = <ShoppingList>({
      list_id: r.shopping_list.list_id,
      user_id: r.shopping_list.user_id,
      created: r.shopping_list.created,
      list_type: r.shopping_list.list_type,
      layout_type: r.shopping_list.layout_type,
      categories: r.shopping_list.categories.map(MappingUtils._toCategory)
    });

    console.log('Parsed dish:', shoppinglist);
    return shoppinglist;
  }
}
