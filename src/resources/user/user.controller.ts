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
import { createSendToken } from "@/utils/token";
import { getMe, protect, restrictTo } from "@/middlewares/user.middleware";

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
      .get(protect, restrictTo("admin"), this.getAllUsers)
      .post(upload.single("imageUrl"), this.signup);

    this.router
      .route(`${this.path}/:id`)
      .get(protect, restrictTo("admin"), this.getUser)
      .delete(protect, restrictTo("admin"), this.deleteUser);

    this.router.post(`${this.path}/login`, this.login);
    this.router.get(`${this.path}/user`, protect, getMe, this.getCurrentUser);
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

  private getCurrentUser = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const id = new Types.ObjectId(req.params.id);
      const user = await this.UserService.findUserById(id);

      return res.status(200).json({
        status: "success",
        data: {
          user,
        },
      });
    }
  );

  private signup = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const file = req.file;
      if (file) {
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
        return createSendToken(user, 201, res);
      }

      const user = await this.UserService.signup({
        ...req.body,
      });
      return createSendToken(user, 201, res);
    }
  );

  private login = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const { email, password } = req.body;

      // 1) Check if email and password exist
      if (!email || !password) {
        return next(
          new HttpException("Please provide email and password!", 400)
        );
      }
      // 2) Check if user exists && password is correct
      const user = await User.findOne({ email }).select("+password");

      if (!user || !(await user.correctPassword(password, user.password!))) {
        return next(new HttpException("Incorrect email or password", 401));
      }

      createSendToken(user, 200, res);
    }
  );

  private getUser = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const id = new Types.ObjectId(req.params.id);
      const user = await this.UserService.findUserById(id);

      return res.status(200).json({
        status: "success",
        data: {
          user,
        },
      });
    }
  );
  private deleteUser = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const id = new Types.ObjectId(req.params.id);

      await this.UserService.deleteUserById(id);

      return res.status(204).json({
        status: "success",
      });
    }
  );
}

export default UserController;
