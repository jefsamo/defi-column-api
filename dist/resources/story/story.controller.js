"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const story_model_1 = __importDefault(require("@/resources/story/story.model"));
const catchAsync_1 = __importDefault(require("@/utils/exceptions/catchAsync"));
const APIFeatures_1 = __importDefault(require("@/utils/APIFeatures"));
const story_service_1 = __importDefault(require("./story.service"));
const user_middleware_1 = require("@/middlewares/user.middleware");
class StoryController {
    constructor() {
        this.path = "/stories";
        this.router = (0, express_1.Router)();
        this.StoryService = new story_service_1.default();
        this.getAllStories = (0, catchAsync_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const features = new APIFeatures_1.default(story_model_1.default.find().populate("author", "name"), req.query)
                .filter()
                .sort()
                .limitFields()
                .paginate();
            const stories = yield features.query;
            return res.status(200).json({
                status: "success",
                result: stories.length,
                data: {
                    stories,
                },
            });
        }));
        this.createStory = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            // const { author } = req.body;
            if (!req.body.author) {
                req.body.author = req.user._id;
            }
            const story = yield this.StoryService.createStory(req.body);
            return res.status(201).json({
                status: "success",
                data: {
                    story,
                },
            });
        }));
        this.initialiseRoutes();
    }
    // Routes handlers
    initialiseRoutes() {
        this.router
            .route(`${this.path}`)
            .get(this.getAllStories)
            .post(user_middleware_1.protect, (0, user_middleware_1.restrictTo)("writer", "admin"), this.createStory);
    }
}
exports.default = StoryController;
