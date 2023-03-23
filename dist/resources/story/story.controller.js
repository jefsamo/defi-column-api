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
const APIFeatures_1 = __importDefault(require("@/utils/APIFeatures"));
const story_service_1 = __importDefault(require("./story.service"));
class StoryController {
    constructor() {
        this.path = "/stories";
        this.router = (0, express_1.Router)();
        this.StoryService = new story_service_1.default();
        this.getAllStories = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const features = new APIFeatures_1.default(story_model_1.default.find(), req.query)
                .filter()
                .sort()
                .limitFields()
                .paginate();
            const stories = yield features.query;
            // const stories = await this.StoryService.getAllStories();
            return res.status(200).json({
                status: "success",
                result: stories.length,
                data: {
                    stories,
                },
            });
        });
        this.initialiseRoutes();
    }
    // Routes handlers
    initialiseRoutes() {
        this.router.route(`${this.path}`).get(this.getAllStories);
    }
}
exports.default = StoryController;
