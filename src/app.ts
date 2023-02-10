import express, { Application, Request, Response, NextFunction } from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import compression from "compression";
import mongoSantize from "express-mongo-sanitize";
import mongoose from "mongoose";
import Controller from "@/utils/interfaces/controller.interface";
import HttpException from "@/utils/exceptions/HttpException";
import globalErrorHandler from "@/utils/exceptions/errorException";
import morganMiddleware from "@/middlewares/morgan.middleware";
import logger from "@/utils/logger";

class App {
  public express: Application;
  public port: number;

  constructor(controllers: Controller[], port: number) {
    this.express = express();
    this.port = port;
    this.initialiseDatabaseConnection();
    this.express.use(morganMiddleware);
    this.initialiseMiddleware();
    this.initialiseControllers(controllers);
    this.express.all("*", (req: Request, res: Response, next: NextFunction) => {
      next(
        new HttpException(`Can't find ${req.originalUrl} on this server!`, 404)
      );
    });
    this.initialiseErrorHandling();
  }

  private initialiseMiddleware(): void {
    this.express.use(express.json());
    this.express.use(helmet());
    this.express.use(cors());
    this.express.use(morgan("dev"));
    this.express.use(express.urlencoded({ extended: false }));
    this.express.use(mongoSantize());
    this.express.use(compression());
  }

  private initialiseControllers(controllers: Controller[]): void {
    controllers.forEach((controller: Controller) => {
      this.express.use("/api/v1", controller.router);
    });
  }
  private initialiseErrorHandling(): void {
    this.express.use(globalErrorHandler);
  }

  private initialiseDatabaseConnection(): void {
    const { DATABASE_LOCAL, DATABASE_PASSWORD } = process.env;
    const DB = DATABASE_LOCAL!.replace("<password>", DATABASE_PASSWORD!);

    mongoose.set("strictQuery", false);
    mongoose.connect(DB).then(() => {
      logger.info("Database connected!");
    });
  }

  public listen(): void {
    this.express.listen(this.port, () => {
      logger.info(`App running on port ${this.port}`);
    });
  }
}

export default App;
