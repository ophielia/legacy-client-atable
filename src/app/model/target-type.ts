export default class TargetType {

  static Standard: string = "Standard";
  static PickUp: string = "PickUp";

  public static listAll(): string[] {
    let all = [
      TargetType.Standard,
      TargetType.PickUp
    ];

    return all;
  }


}
