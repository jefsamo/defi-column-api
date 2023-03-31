"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const slugify_1 = __importDefault(require("slugify"));
const storySchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, "A story must have a title"],
        unique: true,
    },
    category: {
        type: String,
        required: [true, "A story must have a category"],
        enum: ["defi", "nfts", "degen", "airdrops", "tutorial"],
    },
    slug: { type: String },
    // And `Schema.Types.ObjectId` in the schema definition.
    author: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    imageUrl: {
        type: String,
        required: [true, "A story must have a banner"],
    },
    previewUrl: {
        type: String,
        required: [true, "A story must have a preview"],
    },
    body: [String],
    created_At: {
        type: Date,
        default: Date.now,
    },
});
storySchema.pre("save", function (next) {
    this.slug = (0, slugify_1.default)(this.title, { lower: true });
    next();
});
const StoryModel = (0, mongoose_1.model)("Story", storySchema);
exports.default = StoryModel;
