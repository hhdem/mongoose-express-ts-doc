import User, { IUser } from "../models/User";

export default class UserService {
  static async getUserByEmail(email: string): Promise<IUser> {
    const user: IUser = await User.findOne({
      email,
    });
    return user;
  }
  static async getUserById(id: string): Promise<IUser> {
    const user: IUser = await User.findOne({
      _id: id,
    });
    return user;
  }
}
