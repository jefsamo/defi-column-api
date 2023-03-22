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
import { v2 as cloudinary } from "cloudinary";
import { upload } from "@/utils/cloudinary";

class UserController implements Controller {
  public path = "/users";
  public router = Router();
  private UserService = new UserService();

  constructor() {
    this.initialiseRoutes();
  }

  // Routes handlers
  public initialiseRoutes(): void {
    this.router
      .route(`${this.path}`)
      .get(this.getAllUsers)
      .post(upload.single("imageUrl"), this.signup);
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

  private signup = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const file = req.file;
      console.log(file);
      console.log(req.body);

      if (!file) {
        return next(new HttpException("No file was chosen", 404));
      }

      // Upload the processed image to Cloudinary

      const uploadedImage = await cloudinary.uploader.upload(file!.path, {
        public_id: file!.originalname.split(".")[0],
        folder: "sample",
        overwrite: true,
      });
      const user = await this.UserService.signup({
        imageUrl: uploadedImage.secure_url,
        ...req.body,
      });
      return res.status(201).json({
        status: "success",
        data: {
          user,
        },
      });
    }
  );
}

export default UserController;
