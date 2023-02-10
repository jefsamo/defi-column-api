import { NextFunction, Request, Response, Router } from "express";
import Controller from "@/utils/interfaces/controller.interface";
import Generic from "@/resources/generic/generic.model";
import catchAsync from "@/utils/exceptions/catchAsync";
import HttpException from "@/utils/exceptions/HttpException";
import APIFeatures from "@/utils/APIFeatures";
import GenericService from "@/resources/generic/generic.service";
import { Types } from "mongoose";

class GenericController implements Controller {
  public path = "/posts";
  public router = Router();
  private GenericService = new GenericService();

  // initialise Generic Model
  private generic = Generic;

  constructor() {
    this.initialiseRoutes();
  }

  // Routes handlers
  private initialiseRoutes(): void {
    this.router.route(`${this.path}`).get(this.getAllDocs).post(this.createDoc);

    this.router
      .route(`${this.path}/:id`)
      .get(this.getDoc)
      .patch(this.updateDoc)
      .delete(this.deleteDoc);
  }

  private getAllDocs = catchAsync(
    async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<Response | void> => {
      const features = new APIFeatures(this.generic.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
      const generics = await features.query;

      return res.status(200).json({
        status: "success",
        result: generics.length,
        data: {
          generics,
        },
      });
    }
  );

  private createDoc = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const generic = await this.GenericService.createPost(req.body);

      return res.status(201).json({
        status: "success",
        data: {
          generic,
        },
      });
    }
  );

  private getDoc = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const id = new Types.ObjectId(req.params.id);
      const generic = await this.GenericService.findPostById(id);

      if (!generic) {
        return next(new HttpException("No doc with this ID", 404));
      }

      return res.status(200).json({
        status: "success",
        data: {
          generic,
        },
      });
    }
  );

  private updateDoc = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const generic = await this.generic.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          runValidators: true,
          returnOriginal: false,
        }
      );
      if (!generic) {
        return next(new HttpException("No doc with this ID", 404));
      }

      return res.status(200).json({
        status: "success",
        data: {
          generic,
        },
      });
    }
  );

  private deleteDoc = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const id = new Types.ObjectId(req.params.id);
      await this.GenericService.deletePostById(id);

      return res.status(204).json({
        status: "success",
      });
    }
  );
}

export default GenericController;
