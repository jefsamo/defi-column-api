import { Types } from "mongoose";

export interface IStory {
  // _id: Types.ObjectId;
  title: string;
  category: string;
  slug: string;
  author: Types.ObjectId;
  imageUrl: string;
  previewUrl: string;
  body: string[];
  created_At: Date;
}
