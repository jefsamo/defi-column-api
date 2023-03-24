"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSendToken = exports.signToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const signToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};
exports.signToken = signToken;
const createSendToken = (user, statusCode, res) => {
    const token = (0, exports.signToken)(user._id);
    const jwtExpiresIn = process.env.JWT_COOKIE_EXPIRES_IN;
    const cookieOptions = {
        expires: new Date(Date.now() + Number(jwtExpiresIn) * 24 * 60 * 60 * 1000),
        httpOnly: true,
    };
    if (process.env.NODE_ENV === "production")
        cookieOptions.secure = true;
    res.cookie("jwt", token, cookieOptions);
    // Remove password from output
    user.password = undefined;
    return res.status(statusCode).json({
        status: "success",
        token,
        data: {
            user,
        },
    });
};
exports.createSendToken = createSendToken;
