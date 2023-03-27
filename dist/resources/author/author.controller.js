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
const HttpException_1 = __importDefault(require("@/utils/exceptions/HttpException"));
const APIFeatures_1 = __importDefault(require("@/utils/APIFeatures"));
const user_middleware_1 = require("@/middlewares/user.middleware");
const user_model_1 = __importDefault(require("../user/user.model"));
const story_service_1 = __importDefault(require("../story/story.service"));
const mongoose_1 = require("mongoose");
class AuthorController {
    constructor() {
        this.path = "/author";
        this.router = (0, express_1.Router)();
        this.StoryService = new story_service_1.default();
        // Get Stories by Writer
        this.getAllStoriesByWriter = (0, catchAsync_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const user = yield user_model_1.default.findOne({ slug: req.params.slug });
            const features = new APIFeatures_1.default(story_model_1.default.findOne({ author: user._id }).populate("author", "name"), req.query)
                .filter()
                .sort()
                .limitFields()
                .paginate();
            const stories = yield features.query;
            return res.status(200).json({
                status: "success",
                data: {
                    stories,
                },
            });
        }));
        // Update Story by writer
        this.updateStoryByWriter = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const id = new mongoose_1.Types.ObjectId(req.params.id);
            const story = yield story_model_1.default.findByIdAndUpdate(id, req.body, {
                returnOriginal: false,
                runValidators: true,
            });
            // To check if logged in user is the same as the writer
            if (JSON.stringify(story === null || story === void 0 ? void 0 : story.author) !== JSON.stringify(req.user._id)) {
                return next(new HttpException_1.default("You can't update this story!", 400));
            }
            if (!story) {
                return next(new HttpException_1.default("No Story with this ID", 404));
            }
            return res.status(200).json({
                status: "success",
                data: {
                    story,
                },
            });
        }));
        // Delete story by writer
        this.deleteStoryByWriter = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const id = new mongoose_1.Types.ObjectId(req.params.id);
            const story = yield this.StoryService.findStoryById(id);
            // To check if logged in user is the same as the writer
            if (JSON.stringify(story === null || story === void 0 ? void 0 : story.author) !== JSON.stringify(req.user._id)) {
                return next(new HttpException_1.default("You can't delete this story!", 400));
            }
            yield this.StoryService.deleteStoryById(id);
            return res.status(204).json({
                status: "success",
            });
        }));
        this.initialiseRoutes();
    }
    // Routes handlers
    initialiseRoutes() {
        this.router
            .route(`${this.path}/:id`)
            .patch(user_middleware_1.protect, this.updateStoryByWriter)
            .delete(user_middleware_1.protect, this.deleteStoryByWriter);
        this.router.route(`${this.path}/:slug`).get(this.getAllStoriesByWriter);
    }
}
exports.default = AuthorController;
