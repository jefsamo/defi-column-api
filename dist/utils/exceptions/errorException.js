"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const HttpException_1 = __importDefault(require("./HttpException"));
const mongoose_1 = require("mongoose");
const logger_1 = __importDefault(require("@/utils/logger"));
const handleCastErrorDB = (err) => {
    if (err instanceof mongoose_1.Error.CastError) {
        const message = `Invalid ${err.path}: ${err.value}.`;
        return new HttpException_1.default(message, 400);
    }
    // const message = `Invalid ${err.path}: ${err.value}.`;
    // return new AppError(message, 400);
};
const handleDuplicateFieldsDB = (err) => {
    //  const value = err.errmsg.match(/(["'])(\\?.)*?\1/g)[0];
    let value = err.message.match(/(["'])(\\?.)*?\1/g)[0];
    value = value.replace(/["]+/g, "");
    const message = `Duplicate field value: ${value}. Please use another value!`;
    return new HttpException_1.default(message, 400);
};
const handleValidationErrorDB = (err) => {
    if (err instanceof mongoose_1.Error.ValidationError) {
        const errors = Object.values(err.errors).map((el) => el.message);
        const message = `Invalid input data. ${errors.join(". ")}`;
        return new HttpException_1.default(message, 400);
    }
};
const handleJWTError = () => new HttpException_1.default("Invalid token. Please log in again!", 401);
const handleJWTExpiredError = () => new HttpException_1.default("Your token has expired! Please log in again.", 401);
const sendErrorDev = (err, req, res) => {
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
    logger_1.default.error("ERROR 💥", err);
    return res.status(err.statusCode).render("error", {
        title: "Something went wrong!",
        msg: err.message,
    });
};
const sendErrorProd = (err, req, res) => {
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
        logger_1.default.error("ERROR 💥", err);
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
    logger_1.default.error("ERROR 💥", err);
    // 2) Send generic message
    return res.status(err.statusCode).render("error", {
        title: "Something went wrong!",
        msg: "Please try again later.",
    });
};
const globalErrorHandler = (err, req, res, next) => {
    // console.log(err.stack);
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";
    if (process.env.NODE_ENV === "development") {
        sendErrorDev(err, req, res);
    }
    else if (process.env.NODE_ENV === "production") {
        let error = Object.assign({}, err);
        error.message = err.message;
        if (error.name === "CastError")
            error = handleCastErrorDB(error);
        if (error.code === 11000)
            error = handleDuplicateFieldsDB(error);
        if (error.name === "ValidationError")
            error = handleValidationErrorDB(error);
        if (error.name === "JsonWebTokenError")
            error = handleJWTError();
        if (error.name === "TokenExpiredError")
            error = handleJWTExpiredError();
        sendErrorProd(error, req, res);
    }
};
exports.default = globalErrorHandler;
