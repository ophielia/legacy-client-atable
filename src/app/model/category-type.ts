export default class CategoryType {

  static UnCategorized: string = "UnCategorized";
  static Highlight: string = "Highlight";
  static HighlightList: string = "HighlightList";
  static Frequent: string = "frequent";
  static Standard: string = "Standard";

  public static listAll(): string[] {
    let all = [
      CategoryType.UnCategorized,
      CategoryType.Highlight,
      CategoryType.Frequent,
      CategoryType.Standard
    ];

    return all;
  }

}
