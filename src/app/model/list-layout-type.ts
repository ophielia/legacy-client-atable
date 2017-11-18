export default class ListLayoutType {

  static All: string = "All";
  static Rough: string = "RoughGrained";
  static Fine: string = "FineGrained";

  public static listAll(): string[] {
    let all = [
      ListLayoutType.All,
      ListLayoutType.Rough,
      ListLayoutType.Fine
    ];

    return all;
  }


}
