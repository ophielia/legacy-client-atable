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
import {ItemSource} from "app/model/item-source";
import {RatingUpdateInfo} from "./rating-update-info";
import {IRatingInfo, RatingInfo} from "./rating-info";
import {DishRatingInfo, IDishRatingInfo} from "./dish-rating-info";
import {User} from "./user";
import {ILegendSource, LegendSource} from "./legend-source";

export default class MappingUtils {

  static showConsoleLogs: boolean = false;

  static toTag(r: any): ITag {
    return MappingUtils._toTag(r.tag);
  }

  static _toRatingInfo(r: any): IRatingInfo {
    let ratingInfo = <RatingInfo>({
      rating_tag_id: r.rating_tag_id,
      label: r.label,
      power: r.power,
      max_power: r.max_power
    });

    if (MappingUtils.showConsoleLogs) {
      console.log('Parsed rating info:', ratingInfo);
    }
    return ratingInfo;
  }

  static _toDishRatingInfo(r: any): IDishRatingInfo {
    let dishRatingInfo = <DishRatingInfo>({
      dish_id: r.dish_id,
      dish_name: r.dish_name,
      ratings: r.ratings.map(MappingUtils._toRatingInfo)
    });
    if (MappingUtils.showConsoleLogs) {
      console.log('Parsed dish rating info:', dishRatingInfo);
    }
    return dishRatingInfo;
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
        reference: r.reference,
        user_id: r.user_id,
        last_added: r.last_added,
        tags: r.tags.map(MappingUtils._toTag)
      })
    ;
    return dish;
  }

  private static _toUser(r: any) {

    let user = <User>({
      email: r.email,
    creation_date: r.creation_date,
    user_name: r.user_name,
    roles: r.roles,
    token: r.token

    });
    return user;
  }

  private static _toRatingUpdateInfo(r: any): RatingUpdateInfo {
    let ratingUpdateInfo = <RatingUpdateInfo>({
        headers: r.headers.map(MappingUtils._toRatingInfo),
        dish_ratings: r.dish_ratings.map(MappingUtils._toDishRatingInfo)
      })
    ;
    return ratingUpdateInfo;
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
    let category = new Category(
      r.name,
      r.items.map(MappingUtils._toItem),
      (r.subcategories ? r.subcategories.map(MappingUtils._toCategory) : null),
      r.category_type,
      null,
      false,
      null
  ) ;


    if (MappingUtils.showConsoleLogs) {
      console.log('Parsed category:', category);

    }

    return category;
  }

  private static _toLegend(r: any) : LegendSource {

    let legend = <ILegendSource>({
      key: r.key,
      display: r.display
    });
    return legend;
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
      dish_sources: [], //r.dish_sources != null ? r.dish_sources.map(MappingUtils._toItemSource) : null,
      list_sources: [], //r.list_sources != null ? r.list_sources.map(MappingUtils._toItemSource) : null,
      source_keys: r.source_keys,
      added: r.added,
      tag_id: r.tag_id,
      used_count: r.used_count,
      free_text: r.free_text,
      crossed_off_ts: r.crossed_off,
      crossed_off: (r.crossed_off != null),
      tag: MappingUtils._toTag(r.tag)
    });

    if (MappingUtils.showConsoleLogs) {
      console.log('Parsed tag:', item);

    }
    return item;
  }

  static _toNewTagDrilldown(r: any) {

    return MappingUtils.toNewTagDrilldown(r.tagDrilldown, 1);
  }

  static toNewTagDrilldown(r: any, level: number) {
    let children = r.children != null ? r.children.map(
      function (x) {
        return MappingUtils.toNewTagDrilldown(x, level + 1);
      }
    ) : null;
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
      "level": level,
      "children": children,
    });

    if (MappingUtils.showConsoleLogs) {
      console.log('Parsed drilldown:', drilldown);

    }
    return drilldown;
  }

  static toUser(r: any): User {
    let user = MappingUtils._toUser(r.user)
    return user;
  }

  static toDish(r: any): Dish {
    let dish = MappingUtils._toDish(r.dish);

    if (MappingUtils.showConsoleLogs) {
      console.log('Parsed dish:', dish);
    }

    return dish;
  }

  static toRatingUpdateInfo(r: any): RatingUpdateInfo {
    let ratingInfo = MappingUtils._toRatingUpdateInfo(r.ratingUpdateInfo);

    if (MappingUtils.showConsoleLogs) {
      console.log('Parsed rating info:', ratingInfo);
    }

    return ratingInfo;
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
      name: r.shopping_list.name,
      is_starter: r.shopping_list.is_starter_list,
      item_count: r.shopping_list.item_count,
      updated: r.shopping_list.updated,
      layout_type: r.shopping_list.list_layout_type,
      //MM clean up
      dish_sources: [], //r.shopping_list.dish_sources != null ? r.shopping_list.dish_sources.map(MappingUtils._toItemSource) : null,
      list_sources: [], //r.shopping_list.list_sources != null ? r.shopping_list.list_sources.map(MappingUtils._toItemSource) : null,
      categories: r.shopping_list.categories != null ? r.shopping_list.categories.map(MappingUtils._toCategory) : null,
      legend: r.shopping_list.legend != null ? r.shopping_list.legend.map(MappingUtils._toLegend) : []
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

  static _toItemSource(r: any): ItemSource {
    let source = <ItemSource>({
      id: r.id,
      display: r.display,
      type: r.type,
      disp_class: null,
    });

    return source;
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
