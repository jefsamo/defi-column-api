import "dotenv/config";
import "module-alias/register";
import App from "./app";
import UserController from "@/resources/user/user.controller";
import StoryController from "@/resources/story/story.controller";
import AuthorController from "@/resources/author/author.controller";
import SavedStoriesController from "@/resources/savedStories/savedStories.controller";
import logger from "@/utils/logger";

const app = new App(
  [
    new UserController(),
    new StoryController(),
    new AuthorController(),
    new SavedStoriesController(),
  ],
  Number(process.env.PORT)
);

app.listen();
//

process.on("uncaughtException", (err) => {
  logger.error("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

// process.on("unhandledRejection", (err: Error) => {
//   console.log("UNHANDLED REJECTION! 💥 Shutting down...");
//   console.log(err.name, err.message);
//   process.exit(1);
// });
//
