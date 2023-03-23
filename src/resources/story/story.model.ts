import { Schema, model, Model } from "mongoose";
import { IStory } from "@/resources/story/story.interface";
import slugify from "slugify";

const storySchema = new Schema<IStory>({
  title: { type: String, required: [true, "A story must have a title"] },
  category: {
    type: String,
    required: [true, "A story must have a category"],
    enum: ["defi", "nfts", "degen", "airdrops", "tutorial"],
  },
  slug: { type: String },
  // And `Schema.Types.ObjectId` in the schema definition.
  author: { type: Schema.Types.ObjectId, ref: "User" },
  imageUrl: {
    type: String,
    required: [true, "A story must have a banner"],
  },
  body: [String],
});

storySchema.pre("save", function (next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

const StoryModel = model<IStory>("Story", storySchema);
storySchema;

export default StoryModel;
