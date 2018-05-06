export class IListGenerateProperties {
  dish_sources: string[];
  meal_plan_source: string[];
  add_from_base: boolean;
  add_from_pickup: boolean;
  generate_mealplan: boolean;

}


export class ListGenerateProperties implements IListGenerateProperties {
  constructor() {
  }

  dish_sources: string[];
  meal_plan_source: string[];
  add_from_base: boolean;
  add_from_pickup: boolean;
  generate_mealplan: boolean;

}

