export default class ItemSourceType {

  static Manual: string = "Manual";

  public static listAll(): string[] {
    let all = [
      ItemSourceType.Manual,
    ];

    return all;
  }

}
