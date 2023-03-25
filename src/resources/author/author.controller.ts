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
import StoryService from "../story/story.service";
import { Types } from "mongoose";

class AuthorController implements Controller {
  public path = "/author";
  public router = Router();
  private StoryService = new StoryService();

  constructor() {
    this.initialiseRoutes();
  }

  // Routes handlers
  public initialiseRoutes(): void {
    this.router
      .route(`${this.path}/:id`)
      .patch(protect, this.updateStoryByWriter)
      .delete(protect, this.deleteStoryByWriter);
    this.router.route(`${this.path}/:slug`).get(this.getAllStoriesByWriter);
  }

  // Get Stories by Writer
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

  // Update Story by writer
  private updateStoryByWriter = catchAsync(
    async (req: RequestUser, res: Response, next: NextFunction) => {
      const id = new Types.ObjectId(req.params.id);
      const story = await Story.findByIdAndUpdate(id, req.body, {
        returnOriginal: false,
        runValidators: true,
      });

      // To check if logged in user is the same as the writer
      if (JSON.stringify(story?.author) !== JSON.stringify(req.user._id)) {
        return next(new HttpException("You can't update this story!", 400));
      }

      if (!story) {
        return next(new HttpException("No Story with this ID", 404));
      }

      return res.status(200).json({
        status: "success",
        data: {
          story,
        },
      });
    }
  );

  private deleteStoryByWriter = catchAsync(
    async (req: RequestUser, res: Response, next: NextFunction) => {
      const id = new Types.ObjectId(req.params.id);

      const story = await this.StoryService.findStoryById(id);

      // To check if logged in user is the same as the writer
      if (JSON.stringify(story?.author) !== JSON.stringify(req.user._id)) {
        return next(new HttpException("You can't delete this story!", 400));
      }
      await this.StoryService.deleteStoryById(id);

      return res.status(204).json({
        status: "success",
      });
    }
  );
}

export default AuthorController;
