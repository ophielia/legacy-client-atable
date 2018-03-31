import {ITag} from "./tag";
import {Dish} from "./dish";
import {TagDrilldown} from "./tag-drilldown";
import {MealPlan} from "./mealplan";
import {Slot} from "./slot";
import {Category} from "./category";
import {Item} from "./item";
import {IShoppingList} from "./shoppinglist";
import {ListLayout} from "./listlayout";
import {ListLayoutCategory} from "./listcategory";
import {Target} from "./target";
import {TargetSlot} from "./target-slot";
import {Proposal} from "./proposal";
import {ProposalSlot} from "./proposal-slot";
import {ProposalDish} from "./proposal-dish";
export default class MappingUtils {

  static showConsoleLogs: boolean = true;

  static toTag(r: any): ITag {
    return MappingUtils._toTag(r.tag);
  }

  static _toTag(r: any): ITag {
    let tag = <ITag>({
      tag_id: r.tag_id,
      name: r.name,
      description: r.description,
      search_select: r.search_select,
      assign_select: r.assign_select,
      power: r.power,
      parent_id: r.parent_id,
      dishes: r.dishes ? r.dishes.map(MappingUtils._toDish) : null,
      is_inverted: false,
      tag_type: r.tag_type
    });

    if (MappingUtils.showConsoleLogs) {
      console.log('Parsed tag:', tag);
    }
    return tag;
  }

  private static _toDish(r: any): Dish {
    let dish = <Dish>({
        dish_id: r.dish_id,
        name: r.name,
        description: r.description,
        user_id: r.user_id,
      last_added: r.last_added,
        tags: r.tags.map(MappingUtils._toTag)
      })
    ;
    return dish;
  }

  private static _toTargetSlot(r: any): TargetSlot {
    let slot = <TargetSlot>({
      target_slot_id: r.target_slot_id,
      slot_dish_tag_id: r.slot_dish_tag_id,
      slot_dish_tag: r.slot_dish_tag ? MappingUtils._toTag(r.slot_dish_tag) : null,
      slot_tags: r.slot_tags ? r.slot_tags.map(MappingUtils._toTag) : null,
      slot_order: r.slot_order,
    });

    if (MappingUtils.showConsoleLogs) {
      console.log('Parsed target slot:', slot);
    }

    return slot;
  }

  private static _toSlot(r: any): Slot {
    let slot = <Slot>({
      slot_id: r.slot_id,
      dish: MappingUtils._toDish(r.dish)
    });

    if (MappingUtils.showConsoleLogs) {
      console.log('Parsed slot:', slot);
    }

    return slot;
  }

  private static _toCategory(r: any): Category {
    let category = <Category>({
      name: r.name,
      items: r.items.map(MappingUtils._toItem),
      subcategories: r.subcategories ? r.subcategories.map(MappingUtils._toCategory) : null

    });

    if (MappingUtils.showConsoleLogs) {
      console.log('Parsed category:', category);

    }

    return category;
  }

  private static _toListLayoutCategory(r: any): ListLayoutCategory {
    let category = <ListLayoutCategory>({
      name: r.name,
      category_id: r.category_id,
      tags: r.tags.map(MappingUtils._toTag),
      subcategories: r.subcategories ? r.subcategories.map(MappingUtils._toListLayoutCategory) : null
    });

    if (MappingUtils.showConsoleLogs) {
      console.log('Parsed category:', category);

    }

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

    if (MappingUtils.showConsoleLogs) {
      console.log('Parsed tag:', item);

    }
    return item;
  }

  static toTagDrilldown(r: any) {
    let drilldown = <TagDrilldown>({
      "tag_id": r.tag_id,
      "name": r.name,
      "description": r.description,
      "tag_type": r.tag_type,
      "parent_id": r.parent_id,
      "children_ids": r.children_ids,
      "assign_select": r.assign_select,
      "search_select": r.search_select,
      "expanded": false,
      "level": 1,
      "children": []
    });

    if (MappingUtils.showConsoleLogs) {
      console.log('Parsed drilldown:', drilldown);

    }
    return drilldown;
  }

  static toDish(r: any): Dish {
    let dish = MappingUtils._toDish(r.dish);

    if (MappingUtils.showConsoleLogs) {
      console.log('Parsed dish:', dish);
    }

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

    if (MappingUtils.showConsoleLogs) {
      console.log('Parsed mealplan:', mealplan);
    }

    return mealplan;
  }

  static toShoppingList(r: any): IShoppingList {
    let shoppinglist = <IShoppingList>({
      list_id: r.shopping_list.list_id,
      user_id: r.shopping_list.user_id,
      created: r.shopping_list.created,
      list_type: r.shopping_list.list_type,
      item_count: r.shopping_list.item_count,
      layout_type: r.shopping_list.list_layout_type,
      categories: r.shopping_list.categories != null ? r.shopping_list.categories.map(MappingUtils._toCategory) : null
    });

    if (MappingUtils.showConsoleLogs) {
      console.log('Parsed list:', shoppinglist);
    }
    return shoppinglist;
  }

  static toListLayout(r: any): ListLayout {
    let listlayouts = <ListLayout>({
      layout_id: r.list_layout.layout_id,
      list_layout_type: r.list_layout.list_layout_type,
      name: r.list_layout.name,
      listcategories: r.list_layout.categories ? r.list_layout.categories.map(MappingUtils._toListLayoutCategory) : null
    });

    if (MappingUtils.showConsoleLogs) {
      console.log('Parsed listlayout:', listlayouts);
    }
    return listlayouts;
  }

  static _toTarget(r: any): Target {
    let target = <Target>({
      created: r.created,
      target_tags: r.target_tags ? r.target_tags.map(MappingUtils._toTag) : null,
      target_id: r.target_id,
      user_id: r.user_id,
      proposal_id: r.proposal_id,
      target_name: r.target_name,
      last_used: r.last_used,
      target_slots: r.target_slots ? r.target_slots.map(MappingUtils._toTargetSlot) : null,
    });

    return target;
  }

  static toTarget(r: any): Target {
    let target = MappingUtils._toTarget(r.target);

    if (MappingUtils.showConsoleLogs) {
      console.log('Parsed target:', target);
    }

    return target;
  }

  static _toProposal(r: any): Proposal {
    let proposal = <Proposal>({
      created: r.created,
      proposal_id: r.proposal_id,
      user_id: r.user_id,
      target_name: r.target_name,
      last_used: r.last_used,
      can_be_refreshed: r.can_be_refreshed,
      target_tags: r.target_tags ? r.target_tags.map(MappingUtils._toTag) : null,
      proposal_slots: r.proposal_slots ? r.proposal_slots.map(MappingUtils._toProposalSlot) : null,
    });

    return proposal;
  }

  static toProposal(r: any): Proposal {
    let proposal = MappingUtils._toProposal(r.proposal);

    if (MappingUtils.showConsoleLogs) {
      console.log('Parsed proposal:', proposal);
    }

    return proposal;
  }

  private static _toProposalSlot(r: any): ProposalSlot {
    let slot = <ProposalSlot>({

      slot_id: r.slot_id,
      slot_dish_tag: MappingUtils._toTag(r.slot_dish_tag),
      tags: r.slot_tags ? r.slot_tags.map(MappingUtils._toTag) : null,
      dish_slot_list: r.dish_slot_list ? r.dish_slot_list.map(MappingUtils._toProposalDishList) : null,
      slot_order: r.slot_order,
      selected_dish_index: r.selected_dish_index,
      selected_dish_id: r.selected_dish_id,

    });

    if (MappingUtils.showConsoleLogs) {
      console.log('Parsed proposal slot:', slot);
    }

    return slot;
  }

  private static _toProposalDishList(r: any): ProposalDish {
    let dish = <ProposalDish>({
      dish: MappingUtils._toDish(r.dish),
      matched_tags: r.matched_tags ? r.matched_tags.map(MappingUtils._toTag) : null,
      selected: false
    });

    if (MappingUtils.showConsoleLogs) {
      console.log('Parsed proposal dish:', dish);
    }

    return dish;
  }
}
