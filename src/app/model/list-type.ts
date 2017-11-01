export default class ListType {

  static BaseList: string = "BaseList";
  static PickUpList: string = "PickUpList";
  static InProcess: string = "InProcess";
  static ActiveList: string = "ActiveList";

  public static listAll(): string[] {
    let all = [
      ListType.BaseList,
      ListType.PickUpList,
      ListType.InProcess,
      ListType.ActiveList,
    ];

    return all;
  }

}
