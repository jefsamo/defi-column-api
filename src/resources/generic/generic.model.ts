import { Schema, model } from "mongoose";
import { IGeneric } from "@/resources/generic/generic.interface";

const postSchema = new Schema<IGeneric>(
  {
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
  },
  {
    timestamps: {
      createdAt: "created_At",
      updatedAt: "updated_At",
    },
  }
);

postSchema.pre<IGeneric>("save", function (next) {
  // this.createdAt = new Date(Date.now() + 3600000);
  next();
});

const Post = model<IGeneric>("Post", postSchema);

export default Post;
