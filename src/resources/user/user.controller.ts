import { NextFunction, Request, Response, Router } from "express";
import Controller, {
  RequestUser,
} from "@/utils/interfaces/controller.interface";
import User from "@/resources/user/user.model";
import catchAsync from "@/utils/exceptions/catchAsync";
import HttpException from "@/utils/exceptions/HttpException";
import APIFeatures from "@/utils/APIFeatures";
import UserService from "./user.service";
import { Types } from "mongoose";

class UserController implements Controller {
  public path = "/users";
  public router = Router();
  private UserService = new UserService();

  constructor() {
    this.initialiseRoutes();
  }

  // Routes handlers
  public initialiseRoutes(): void {
    this.router.route(`${this.path}`).get(this.getAllUsers);
  }
  private getAllUsers = async (req: Request, res: Response) => {
    const features = new APIFeatures(User.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const users = await features.query;
    // const users = await this.UserService.getAllUsers();
    return res.status(200).json({
      status: "success",
      result: users.length,
      data: {
        users,
      },
    });
  };
}

export default UserController;
