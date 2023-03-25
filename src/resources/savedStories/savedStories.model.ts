import { Schema, model } from "mongoose";
import { ISavedStories } from "@/resources/savedStories/savedStories.interface";

const savedStorySchema = new Schema<ISavedStories>({
  // And `Schema.Types.ObjectId` in the schema definition.
  user: { type: Schema.Types.ObjectId, ref: "User" },
  story: { type: Schema.Types.ObjectId, ref: "Story", unique: true },
  created_At: {
    type: Date,
    default: Date.now,
  },
});

const SavedStoriesModel = model<ISavedStories>(
  "SavedStories",
  savedStorySchema
);

export default SavedStoriesModel;
