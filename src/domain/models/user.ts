import { UserModel } from '@/domain/contracts/models';

export class User {
  public id: string;
  public firstName: string;
  public lastName: string;
  public username: string;
  public email: string;

  constructor(data: UserModel) {
    this.id = data.id;
    this.username = data.username;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.email = data.email;
  }
}
