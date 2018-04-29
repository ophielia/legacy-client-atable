export default class ListType {

  static BaseList: string = "BaseList";
  static PickUpList: string = "PickUpList";
  static InProcess: string = "InProcess";
  static ActiveList: string = "ActiveList";
  static General: string = "General";

  public static listAll(): string[] {
    let all = [
      ListType.BaseList,
      ListType.PickUpList,
      ListType.InProcess,
      ListType.ActiveList,
      ListType.General,
    ];

    return all;
  }

}
