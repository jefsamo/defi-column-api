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
const generic_model_1 = __importDefault(require("@/resources/generic/generic.model"));
const HttpException_1 = __importDefault(require("@/utils/exceptions/HttpException"));
class GenericService {
    constructor() {
        this.generic = generic_model_1.default;
    }
    createPost(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { imageCover, postUrl, title } = body;
                const post = yield this.generic.create({ imageCover, postUrl, title });
                return post;
            }
            catch (error) {
                throw new HttpException_1.default("Unable to create post", 400);
            }
        });
    }
    getAllPosts() {
        return __awaiter(this, void 0, void 0, function* () {
            //   const features = new APIFeatures(this.post.find(), req.query)
            //     .filter()
            //     .sort()
            //     .limitFields()
            //     .paginate();
            //   const posts = await features.query;
            try {
                const post = yield this.generic.find();
                return post;
            }
            catch (error) {
                throw new HttpException_1.default("Unable to create post", 400);
            }
        });
    }
    deletePostById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.generic.findByIdAndDelete(id);
            }
            catch (error) {
                throw new HttpException_1.default("Unable to delete post", 400);
            }
        });
    }
    findPostById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const post = yield this.generic.findById(id);
                return post;
            }
            catch (error) {
                throw new HttpException_1.default("Unable to find post", 400);
            }
        });
    }
}
exports.default = GenericService;
