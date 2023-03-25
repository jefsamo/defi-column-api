import { Types } from "mongoose";

export interface ISavedStories {
  user: Types.ObjectId;
  story: Types.ObjectId;
  created_At: Date;
}
