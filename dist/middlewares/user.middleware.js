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
exports.getMe = exports.restrictTo = exports.protect = void 0;
const user_model_1 = __importDefault(require("@/resources/user/user.model"));
const catchAsync_1 = __importDefault(require("@/utils/exceptions/catchAsync"));
const HttpException_1 = __importDefault(require("@/utils/exceptions/HttpException"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.protect = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // 1) Getting token and check of it's there
    let token;
    if (req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
        return next(new HttpException_1.default("You are not logged in! Please log in to get access.", 401));
    }
    // 2) Verification token
    const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
    // 3) Check if user still exists
    const currentUser = yield user_model_1.default.findById(decoded.id);
    console.log(currentUser);
    if (!currentUser) {
        return next(new HttpException_1.default("The user belonging to this token does no longer exist.", 401));
    }
    // 4) Check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next(new HttpException_1.default("User recently changed password! Please log in again.", 401));
    }
    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    next();
}));
const restrictTo = (...roles) => {
    return (req, res, next) => {
        // roles ['admin', 'super-admin']. role='user'
        if (!roles.includes(req.user.role)) {
            return next(new HttpException_1.default("You do not have permission to perform this action", 403));
        }
        next();
    };
};
exports.restrictTo = restrictTo;
const getMe = (req, res, next) => {
    req.params.id = req.user.id;
    console.log(req.user);
    next();
};
exports.getMe = getMe;
