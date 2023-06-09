import { NextFunction, Request, Response, Router } from "express";
import Controller, {
  RequestUser,
} from "@/utils/interfaces/controller.interface";
import Story from "@/resources/story/story.model";
import SavedStory from "@/resources/savedStories/savedStories.model";
import catchAsync from "@/utils/exceptions/catchAsync";
import HttpException from "@/utils/exceptions/HttpException";
import APIFeatures from "@/utils/APIFeatures";
import StoryService from "./story.service";
import { protect, restrictTo } from "@/middlewares/user.middleware";
import { Types } from "mongoose";
// import { type } from "os";

class StoryController implements Controller {
  public path = "/stories";
  public router = Router();

  private StoryService = new StoryService();

  constructor() {
    this.initialiseRoutes();
  }

  // Routes handlers
  public initialiseRoutes(): void {
    this.router.get(`${this.path}/latest`, this.getLatestStories);
    this.router.route(`${this.path}/:id/save`).post(protect, this.saveStory);
    this.router.route(`${this.path}/airdrops`).get(this.getStoriesByCategory);

    this.router.get(`${this.path}/:id`, this.getStory);
    this.router.get(`${this.path}/:slug`, this.getStoryBySlug);
    this.router
      .route(`${this.path}/:id/remove`)
      .delete(protect, this.deleteASavedStory);

    this.router
      .route(`${this.path}/:id`)
      .delete(protect, restrictTo("admin"), this.deleteStory)
      .patch(protect, restrictTo("admin"), this.updateStory);

    this.router
      .route(`${this.path}`)
      .get(this.getAllStories)
      .post(protect, restrictTo("writer"), this.createStory);
  }

  private getAllStories = catchAsync(async (req: Request, res: Response) => {
    const features = new APIFeatures(
      Story.find().populate("author", "name"),
      req.query
    )
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const stories = await features.query;

    return res.status(200).json({
      status: "success",
      result: stories.length,
      data: {
        stories,
      },
    });
  });

  private createStory = catchAsync(
    async (req: RequestUser, res: Response, next: NextFunction) => {
      // const { author } = req.body;
      if (!req.body.author) {
        req.body.author = req.user._id;
      }

      const story = await this.StoryService.createStory(req.body);

      return res.status(201).json({
        status: "success",
        data: {
          story,
        },
      });
    }
  );

  private getStory = catchAsync(
    async (req: RequestUser, res: Response, next: NextFunction) => {
      // const { author } = req.body;
      const id = new Types.ObjectId(req.params.id);

      const story = await this.StoryService.findStoryById(id);

      return res.status(200).json({
        status: "success",
        data: {
          story,
        },
      });
    }
  );

  private getStoryBySlug = catchAsync(
    async (req: RequestUser, res: Response, next: NextFunction) => {
      // const { author } = req.body;
      // const id = new Types.ObjectId(req.params.id);

      const story = await Story.findOne({ slug: req.params.slug });

      return res.status(200).json({
        status: "success",
        data: {
          story,
        },
      });
    }
  );

  private updateStory = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const story = await Story.findByIdAndUpdate(req.params.id, req.body, {
        returnOriginal: false,
        runValidators: true,
      });

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

  private deleteStory = catchAsync(
    async (req: RequestUser, res: Response, next: NextFunction) => {
      // const { author } = req.body;
      const id = new Types.ObjectId(req.params.id);

      await this.StoryService.deleteStoryById(id);

      return res.status(204).json({
        status: "success",
      });
    }
  );

  private saveStory = catchAsync(
    async (req: RequestUser, res: Response, next: NextFunction) => {
      // const { author } = req.body;
      const id = new Types.ObjectId(req.params.id);

      const story = await this.StoryService.findStoryById(id);
      if (!story) {
        return;
      }
      const checkStoryForDuplication = await SavedStory.findOne({ story: id });
      console.log(checkStoryForDuplication);
      if (checkStoryForDuplication) {
        return next(new HttpException("Story already saved", 400));
      }

      const savedStory = await SavedStory.create({
        story: id,
        user: req.user._id,
      });

      return res.status(201).json({
        status: "success",
        data: {
          savedStory,
        },
      });
    }
  );

  private deleteASavedStory = catchAsync(
    async (req: RequestUser, res: Response, next: NextFunction) => {
      // const { author } = req.body;
      const id = new Types.ObjectId(req.params.id);

      await SavedStory.findOneAndDelete({ story: id });

      return res.status(204).json({
        status: "success",
      });
    }
  );
  // Break it down to all categories instead of one category
  private getStoriesByCategory = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const features = new APIFeatures(
        Story.find({ category: "airdrops" }).populate(
          "author",
          "name created_At"
        ),
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

  private getLatestStories = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const date = new Date();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const day = date.getDate();

      console.log(`${year}-${month}-${day}`);
      const features = new APIFeatures(
        Story.find({
          created_At: {
            $gte: `${year}-${month}-${day}`,
            $lte: `${year}-${month}-${day + 1}`,
          },
        }).populate("author", "name"),
        req.query
      )
        .filter()
        .sort()
        .limitFields()
        .paginate();

      const stories = await features.query;

      return res.status(200).json({
        status: "success",
        result: stories.length,
        data: {
          stories,
        },
      });
    }
  );
}

export default StoryController;
