import { NextFunction, Request, Response, Router } from "express";
import Controller, {
  RequestUser,
} from "@/utils/interfaces/controller.interface";
import SavedStories from "@/resources/savedStories/savedStories.model";
import catchAsync from "@/utils/exceptions/catchAsync";
import { protect, restrictTo } from "@/middlewares/user.middleware";

class SavedStoryController implements Controller {
  public path = "/saved-stories";
  public router = Router();

  constructor() {
    this.initialiseRoutes();
  }

  // Routes handlers
  public initialiseRoutes(): void {
    this.router.get(`${this.path}`, protect, this.getAllSavedStories);
  }

  private getAllSavedStories = catchAsync(
    async (req: RequestUser, res: Response, next: NextFunction) => {
      if (!req.body.user) {
        req.body.user = req.user._id;
      }
      const savedStories = await SavedStories.find({
        user: req.user._id,
      })
        .populate("story", "title previewUrl created_At")
        .sort("-created_At");

      return res.status(200).json({
        status: "success",
        data: {
          savedStories,
        },
      });
    }
  );
}

export default SavedStoryController;
