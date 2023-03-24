import { NextFunction, Request, Response, Router } from "express";
import Controller, {
  RequestUser,
} from "@/utils/interfaces/controller.interface";
import Story from "@/resources/story/story.model";
import catchAsync from "@/utils/exceptions/catchAsync";
import HttpException from "@/utils/exceptions/HttpException";
import APIFeatures from "@/utils/APIFeatures";
import { protect, restrictTo } from "@/middlewares/user.middleware";
import UserModel from "../user/user.model";

class AuthorController implements Controller {
  public path = "/author";
  public router = Router();

  constructor() {
    this.initialiseRoutes();
  }

  // Routes handlers
  public initialiseRoutes(): void {
    this.router.route(`${this.path}/:slug`).get(this.getAllStoriesByWriter);
  }

  private getAllStoriesByWriter = catchAsync(
    async (req: Request, res: Response) => {
      const user = await UserModel.findOne({ slug: req.params.slug });

      const features = new APIFeatures(
        Story.findOne({ author: user!._id }).populate("author", "name"),
        req.query
      )
        .filter()
        .sort()
        .limitFields()
        .paginate();

      const stories = await features.query;

      return res.status(200).json({
        status: "success",
        data: {
          stories,
        },
      });
    }
  );
}

export default AuthorController;
