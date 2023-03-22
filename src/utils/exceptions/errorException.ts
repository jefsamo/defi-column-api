import HttpException from "./HttpException";
import { NextFunction, Request, Response } from "express";
import { Error } from "mongoose";
import logger from "@/utils/logger";

interface ResponseError extends Error {
  statusCode?: number;
  status: string;
  code: number;
  errmsg: string;
}

interface ErrorResponse extends Error {
  statusCode: number | undefined;
  status: number | undefined;
}

const handleCastErrorDB = (err: Error) => {
  if (err instanceof Error.CastError) {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new HttpException(message, 400);
  }
  // const message = `Invalid ${err.path}: ${err.value}.`;
  // return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err: ResponseError) => {
  //  const value = err.errmsg.match(/(["'])(\\?.)*?\1/g)[0];
  let value = err.message.match(/(["'])(\\?.)*?\1/g)![0];
  value = value.replace(/["]+/g, "");
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new HttpException(message, 400);
};

const handleValidationErrorDB = (err: Error) => {
  if (err instanceof Error.ValidationError) {
    const errors = Object.values(err.errors).map((el: any) => el.message);
    const message = `Invalid input data. ${errors.join(". ")}`;
    return new HttpException(message, 400);
  }
};

const handleJWTError = () =>
  new HttpException("Invalid token. Please log in again!", 401);

const handleJWTExpiredError = () =>
  new HttpException("Your token has expired! Please log in again.", 401);

const sendErrorDev = (err: any, req: Request, res: Response) => {
  // A) API
  if (req.originalUrl.startsWith("/api")) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }

  // B) RENDERED WEBSITE
  logger.error("ERROR 💥", err);
  return res.status(err.statusCode).render("error", {
    title: "Something went wrong!",
    msg: err.message,
  });
};

const sendErrorProd = (err: any, req: Request, res: Response) => {
  // A) API
  if (req.originalUrl.startsWith("/api")) {
    // A) Operational, trusted error: send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    // B) Programming or other unknown error: don't leak error details
    // 1) Log error
    logger.error("ERROR 💥", err);
    // 2) Send generic message
    return res.status(500).json({
      status: "error",
      message: "Something went very wrong!",
    });
  }

  // B) RENDERED WEBSITE
  // A) Operational, trusted error: send message to client
  if (err.isOperational) {
    return res.status(err.statusCode).render("error", {
      title: "Something went wrong!",
      msg: err.message,
    });
  }
  // B) Programming or other unknown error: don't leak error details
  // 1) Log error
  logger.error("ERROR 💥", err);
  // 2) Send generic message
  return res.status(err.statusCode).render("error", {
    title: "Something went wrong!",
    msg: "Please try again later.",
  });
};

const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // console.log(err.stack);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    error.message = err.message;

    if (error.name === "CastError") error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === "ValidationError")
      error = handleValidationErrorDB(error);
    if (error.name === "JsonWebTokenError") error = handleJWTError();
    if (error.name === "TokenExpiredError") error = handleJWTExpiredError();

    sendErrorProd(error, req, res);
  }
};

export default globalErrorHandler;
