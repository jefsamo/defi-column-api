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
const APIFeatures_1 = __importDefault(require("@/utils/APIFeatures"));
const user_service_1 = __importDefault(require("./user.service"));
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
        this.initialiseRoutes();
    }
    // Routes handlers
    initialiseRoutes() {
        this.router.route(`${this.path}`).get(this.getAllUsers);
    }
}
exports.default = UserController;
