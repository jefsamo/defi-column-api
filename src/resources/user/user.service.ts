import UserModel from "@/resources/user/user.model";
import { IUser } from "@/resources/user/user.interface";
import HttpException from "@/utils/exceptions/HttpException";
import { Types } from "mongoose";

class UserService {
  private user = UserModel;

  public async signup(body: IUser): Promise<IUser> {
    const { name, email, password, passwordConfirm, role, imageUrl, slug } =
      body;

    const newUser = await this.user.create({
      name,
      email,
      password,
      passwordConfirm,
      role,
      imageUrl,
      slug,
    });

    return newUser;
  }
  public async getAllUsers(): Promise<IUser[]> {
    const users = await this.user.find();

    return users;
  }

  public async findUserById(id: Types.ObjectId): Promise<IUser | null> {
    const user = await this.user.findById(id);

    if (!user) {
      throw new HttpException("No user with this id to get user", 404);
    }
    return user;
  }
  public async deleteUserById(id: Types.ObjectId): Promise<void> {
    const user = await this.user.findByIdAndDelete(id);
    if (!user) {
      throw new HttpException("No user with this id to get user", 404);
    }
  }
}

export default UserService;
