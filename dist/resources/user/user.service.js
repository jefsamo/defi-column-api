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
const user_model_1 = __importDefault(require("@/resources/user/user.model"));
const HttpException_1 = __importDefault(require("@/utils/exceptions/HttpException"));
// import otpGenerator from "otp-generator";
class UserService {
    constructor() {
        this.user = user_model_1.default;
    }
    signup(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, email, password, passwordConfirm, role, imageUrl, slug } = body;
            const newUser = yield this.user.create({
                name,
                email,
                password,
                passwordConfirm,
                role,
                imageUrl,
                slug,
            });
            // console.log(newUser.createSignupToken());
            return newUser;
        });
    }
    getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield this.user.find();
            return users;
        });
    }
    findUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.user.findById(id);
            if (!user) {
                throw new HttpException_1.default("No user with this id to get user", 404);
            }
            return user;
        });
    }
    deleteUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.user.findByIdAndDelete(id);
            if (!user) {
                throw new HttpException_1.default("No user with this id to get user", 404);
            }
        });
    }
}
exports.default = UserService;
