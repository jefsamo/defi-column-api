import "dotenv/config";
import "module-alias/register";
import App from "./app";
import GenericController from "@/resources/generic/generic.controller";
import logger from "@/utils/logger";

const app = new App([new GenericController()], Number(process.env.PORT));

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
