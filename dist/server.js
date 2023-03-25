"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
require("module-alias/register");
const app_1 = __importDefault(require("./app"));
const user_controller_1 = __importDefault(require("@/resources/user/user.controller"));
const story_controller_1 = __importDefault(require("@/resources/story/story.controller"));
const author_controller_1 = __importDefault(require("@/resources/author/author.controller"));
const savedStories_controller_1 = __importDefault(require("@/resources/savedStories/savedStories.controller"));
const logger_1 = __importDefault(require("@/utils/logger"));
const app = new app_1.default([
    new user_controller_1.default(),
    new story_controller_1.default(),
    new author_controller_1.default(),
    new savedStories_controller_1.default(),
], Number(process.env.PORT));
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
