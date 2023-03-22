"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
require("module-alias/register");
const app_1 = __importDefault(require("./app"));
// import GenericController from "@/resources/generic/generic.controller";
const user_controller_1 = __importDefault(require("@/resources/user/user.controller"));
const logger_1 = __importDefault(require("@/utils/logger"));
const app = new app_1.default([new user_controller_1.default()], Number(process.env.PORT));
app.listen();
//
process.on("uncaughtException", (err) => {
    logger_1.default.error("UNCAUGHT EXCEPTION! 💥 Shutting down...");
    console.log(err.name, err.message);
    process.exit(1);
});
// process.on("unhandledRejection", (err: Error) => {
//   console.log("UNHANDLED REJECTION! 💥 Shutting down...");
//   console.log(err.name, err.message);
//   process.exit(1);
// });
//
