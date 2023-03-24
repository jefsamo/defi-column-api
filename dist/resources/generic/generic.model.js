"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const postSchema = new mongoose_1.Schema({
    imageCover: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        unique: true,
        required: true,
    },
    postUrl: {
        type: String,
        required: true,
    },
}, {
    timestamps: {
        createdAt: "created_At",
        updatedAt: "updated_At",
    },
});
postSchema.pre("save", function (next) {
    // this.createdAt = new Date(Date.now() + 3600000);
    next();
});
const Post = (0, mongoose_1.model)("Post", postSchema);
exports.default = Post;
