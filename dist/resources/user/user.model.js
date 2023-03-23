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
const mongoose_1 = require("mongoose");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "A User must have a name!"],
    },
    email: {
        type: String,
        unique: true,
        required: [true, "A User must have an email!"],
        lowercase: true,
    },
    role: {
        type: String,
        enum: ["user", "admin", "writer"],
        default: "user",
    },
    imageUrl: {
        type: String,
        default: "default.png",
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
        minlength: 8,
        select: false,
    },
    passwordConfirm: {
        type: String,
        required: [true, "Please confirm your password"],
        validate: {
            // This only works on CREATE and SAVE!!!
            validator: function (el) {
                return el === this.password;
            },
            message: "Password are not the same!",
        },
    },
    googleId: String,
    passwordChangedAt: String,
    passwordResetToken: String,
    passwordResetExpires: Date,
    created_At: {
        type: Date,
        default: Date.now,
    },
});
userSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        // Only run this function if password was actually modified
        if (!this.isModified("password"))
            return next();
        // Hash the password with cost of 12
        this.password = yield bcryptjs_1.default.hash(this.password, 12);
        // Delete passwordConfirm field
        this.passwordConfirm = undefined;
        this.created_At = new Date(Date.now() + 60 * 60 * 1000);
        next();
    });
});
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = this.passwordChangedAt.getTime() / 1000;
        10;
        return JWTTimestamp < changedTimestamp;
    }
    // False means NOT changed
    return false;
};
userSchema.methods.correctPassword = function (candidatePassword, userPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcryptjs_1.default.compare(candidatePassword, userPassword);
    });
};
const UserModel = (0, mongoose_1.model)("User", userSchema);
exports.default = UserModel;
