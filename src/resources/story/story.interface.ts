import { Types, PopulatedDoc } from "mongoose";
// import { IUser } from "../user/user.interface";

export interface IStory {
  // _id: Types.ObjectId;
  title: string;
  category: string;
  slug: string;
  author: Types.ObjectId;
  // author: IUser["_id"];
  imageUrl: string;
  previewUrl: string;
  body: string[];
  created_At: Date;
}
