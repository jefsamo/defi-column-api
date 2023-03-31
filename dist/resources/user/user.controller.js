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
const user_model_1 = __importDefault(require("@/resources/user/user.model"));
const catchAsync_1 = __importDefault(require("@/utils/exceptions/catchAsync"));
const HttpException_1 = __importDefault(require("@/utils/exceptions/HttpException"));
const APIFeatures_1 = __importDefault(require("@/utils/APIFeatures"));
const user_service_1 = __importDefault(require("./user.service"));
const mongoose_1 = require("mongoose");
const cloudinary_1 = require("cloudinary");
const cloudinary_2 = require("@/utils/cloudinary");
const token_1 = require("@/utils/token");
const user_middleware_1 = require("@/middlewares/user.middleware");
class UserController {
    constructor() {
        this.path = "/users";
        this.router = (0, express_1.Router)();
        this.UserService = new user_service_1.default();
        this.getAllUsers = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const features = new APIFeatures_1.default(user_model_1.default.find(), req.query)
                .filter()
                .sort()
                .limitFields()
                .paginate();
            const users = yield features.query;
            // const users = await this.UserService.getAllUsers();
            return res.status(200).json({
                status: "success",
                result: users.length,
                data: {
                    users,
                },
            });
        });
        this.getWriters = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const features = new APIFeatures_1.default(user_model_1.default.find({ role: "writer" }), req.query)
                .filter()
                .sort()
                .limitFields()
                .paginate();
            const users = yield features.query;
            // const users = await this.UserService.getAllUsers();
            return res.status(200).json({
                status: "success",
                result: users.length,
                data: {
                    users,
                },
            });
        });
        this.getCurrentUser = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const id = new mongoose_1.Types.ObjectId(req.params.id);
            const user = yield this.UserService.findUserById(id);
            return res.status(200).json({
                status: "success",
                data: {
                    user,
                },
            });
        }));
        this.signup = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const file = req.file;
            if (file) {
                // Upload the processed image to Cloudinary
                const uploadedImage = yield cloudinary_1.v2.uploader.upload(file.path, {
                    public_id: file.originalname.split(".")[0],
                    folder: "sample",
                    overwrite: true,
                });
                const user = yield this.UserService.signup(Object.assign({ imageUrl: uploadedImage.secure_url }, req.body));
                return (0, token_1.createSendToken)(user, 201, res);
            }
            const user = yield this.UserService.signup(Object.assign({}, req.body));
            return (0, token_1.createSendToken)(user, 201, res);
        }));
        this.login = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            // 1) Check if email and password exist
            if (!email || !password) {
                return next(new HttpException_1.default("Please provide email and password!", 400));
            }
            // 2) Check if user exists && password is correct
            const user = yield user_model_1.default.findOne({ email }).select("+password");
            if (!user || !(yield user.correctPassword(password, user.password))) {
                return next(new HttpException_1.default("Incorrect email or password", 401));
            }
            (0, token_1.createSendToken)(user, 200, res);
        }));
        this.getUser = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const id = new mongoose_1.Types.ObjectId(req.params.id);
            const user = yield this.UserService.findUserById(id);
            return res.status(200).json({
                status: "success",
                data: {
                    user,
                },
            });
        }));
        this.deleteUser = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const id = new mongoose_1.Types.ObjectId(req.params.id);
            yield this.UserService.deleteUserById(id);
            return res.status(204).json({
                status: "success",
            });
        }));
        this.initialiseRoutes();
    }
    // Routes handlers
    initialiseRoutes() {
        this.router.get(`${this.path}/writers`, this.getWriters);
        this.router
            .route(`${this.path}`)
            .get(user_middleware_1.protect, (0, user_middleware_1.restrictTo)("admin"), this.getAllUsers)
            .post(cloudinary_2.upload.single("imageUrl"), this.signup);
        this.router.get(`${this.path}/user`, user_middleware_1.protect, user_middleware_1.getMe, this.getCurrentUser);
        this.router
            .route(`${this.path}/:id`)
            .get(user_middleware_1.protect, (0, user_middleware_1.restrictTo)("admin"), this.getUser)
            .delete(user_middleware_1.protect, (0, user_middleware_1.restrictTo)("admin"), this.deleteUser);
        this.router.post(`${this.path}/login`, this.login);
    }
}
exports.default = UserController;
