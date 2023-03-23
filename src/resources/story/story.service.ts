import StoryModel from "@/resources/story/story.model";
import HttpException from "@/utils/exceptions/HttpException";
import { Types } from "mongoose";
import { IStory } from "./story.interface";
// import otpGenerator from "otp-generator";

class StoryService {
  private story = StoryModel;

  public async createStory(bodyM: IStory): Promise<IStory> {
    const { title, author, body, category, imageUrl } = bodyM;

    const story = await this.story.create({
      title,
      author,
      body,
      category,
      imageUrl,
    });

    return story;
  }
  public async getAllStories(): Promise<IStory[]> {
    const stories = await this.story.find().populate("author");

    return stories;
  }

  public async findStoryById(id: Types.ObjectId): Promise<IStory | null> {
    const story = await this.story.findById(id);

    if (!story) {
      throw new HttpException("No story with this id", 404);
    }
    return story;
  }
  public async deleteStoryById(id: Types.ObjectId): Promise<void> {
    const story = await this.story.findByIdAndDelete(id);
    if (!story) {
      throw new HttpException("No story with this id", 404);
    }
  }
}

export default StoryService;
