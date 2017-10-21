export default class TagType {

  static TagType: string = "TagType";
  static Rating: string = "Rating";
  static Ingredient: string = "Ingredient";
  static DishType: string = "DishType";

  public static listAll(): string[] {
    let all = [
      TagType.TagType,
      TagType.Rating,
      TagType.Ingredient,
      TagType.DishType
    ];

    return all;
  }

}
