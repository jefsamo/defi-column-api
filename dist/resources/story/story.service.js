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
const story_model_1 = __importDefault(require("@/resources/story/story.model"));
const HttpException_1 = __importDefault(require("@/utils/exceptions/HttpException"));
// import otpGenerator from "otp-generator";
class StoryService {
    constructor() {
        this.story = story_model_1.default;
    }
    createStory(bodyM) {
        return __awaiter(this, void 0, void 0, function* () {
            const { title, author, body, category, imageUrl } = bodyM;
            const story = yield this.story.create({
                title,
                author,
                body,
                category,
                imageUrl,
            });
            return story;
        });
    }
    getAllStories() {
        return __awaiter(this, void 0, void 0, function* () {
            const stories = yield this.story.find().populate("author");
            return stories;
        });
    }
    findStoryById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const story = yield this.story.findById(id);
            if (!story) {
                throw new HttpException_1.default("No story with this id", 404);
            }
            return story;
        });
    }
    deleteStoryById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const story = yield this.story.findByIdAndDelete(id);
            if (!story) {
                throw new HttpException_1.default("No story with this id", 404);
            }
        });
    }
}
exports.default = StoryService;
