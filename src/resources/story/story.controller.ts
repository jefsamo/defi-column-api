import { NextFunction, Request, Response, Router } from "express";
import Controller, {
  RequestUser,
} from "@/utils/interfaces/controller.interface";
import Story from "@/resources/story/story.model";
import catchAsync from "@/utils/exceptions/catchAsync";
import HttpException from "@/utils/exceptions/HttpException";
import APIFeatures from "@/utils/APIFeatures";
import StoryService from "./story.service";
import { Types } from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import { upload } from "@/utils/cloudinary";
import { createSendToken } from "@/utils/token";
import { getMe, protect, restrictTo } from "@/middlewares/user.middleware";

class StoryController implements Controller {
  public path = "/stories";
  public router = Router();
  private StoryService = new StoryService();

  constructor() {
    this.initialiseRoutes();
  }

  // Routes handlers
  public initialiseRoutes(): void {
    this.router.route(`${this.path}`).get(this.getAllStories);
  }
  private getAllStories = async (req: Request, res: Response) => {
    const features = new APIFeatures(Story.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const stories = await features.query;
    // const stories = await this.StoryService.getAllStories();
    return res.status(200).json({
      status: "success",
      result: stories.length,
      data: {
        stories,
      },
    });
  };
}

export default StoryController;
