import RoleType from "./role-type";

export interface IUser {
  email: string;
  creation_date: string;
  user_name: string;
  roles: RoleType[];
  token: string;
}


export class User implements IUser {

  constructor() {
  }

  email: string;
  creation_date: string;
  user_name: string;
  roles: RoleType[];
  token: string;
}
