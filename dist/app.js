"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const compression_1 = __importDefault(require("compression"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const mongoose_1 = __importDefault(require("mongoose"));
const HttpException_1 = __importDefault(require("@/utils/exceptions/HttpException"));
const errorException_1 = __importDefault(require("@/utils/exceptions/errorException"));
const morgan_middleware_1 = __importDefault(require("@/middlewares/morgan.middleware"));
const logger_1 = __importDefault(require("@/utils/logger"));
class App {
    constructor(controllers, port) {
        this.express = (0, express_1.default)();
        this.port = port;
        this.initialiseDatabaseConnection();
        this.express.use(morgan_middleware_1.default);
        this.initialiseMiddleware();
        this.initialiseControllers(controllers);
        this.express.all("*", (req, res, next) => {
            next(new HttpException_1.default(`Can't find ${req.originalUrl} on this server!`, 404));
        });
        this.initialiseErrorHandling();
    }
    initialiseMiddleware() {
        this.express.use(express_1.default.json());
        this.express.use((0, helmet_1.default)());
        this.express.use((0, cors_1.default)());
        this.express.use((0, morgan_1.default)("dev"));
        this.express.use(express_1.default.urlencoded({ extended: false }));
        this.express.use((0, express_mongo_sanitize_1.default)());
        this.express.use((0, compression_1.default)());
    }
    initialiseControllers(controllers) {
        controllers.forEach((controller) => {
            this.express.use("/api/v1", controller.router);
        });
    }
    initialiseErrorHandling() {
        this.express.use(errorException_1.default);
    }
    initialiseDatabaseConnection() {
        const { DATABASE_LOCAL, DATABASE_PASSWORD } = process.env;
        // const DB = DATABASE_LOCAL!.replace("<password>", DATABASE_PASSWORD!);
        const DB = DATABASE_LOCAL;
        mongoose_1.default.set("strictQuery", false);
        mongoose_1.default.connect(DB).then(() => {
            logger_1.default.info("Database connected!");
        });
    }
    listen() {
        this.express.listen(this.port, () => {
            logger_1.default.info(`App running on port ${this.port}`);
        });
    }
}
exports.default = App;
