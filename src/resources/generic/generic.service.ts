import Generic from "@/resources/generic/generic.model";
import { IGeneric } from "@/resources/generic/generic.interface";
import HttpException from "@/utils/exceptions/HttpException";
import { Types } from "mongoose";

class GenericService {
  private generic = Generic;

  public async createPost(body: IGeneric): Promise<IGeneric | null> {
    try {
      const { imageCover, postUrl, title } = body;

      const post = await this.generic.create({ imageCover, postUrl, title });
      return post;
    } catch (error) {
      throw new HttpException("Unable to create post", 400);
    }
  }
  public async getAllPosts(): Promise<IGeneric[]> {
    //   const features = new APIFeatures(this.post.find(), req.query)
    //     .filter()
    //     .sort()
    //     .limitFields()
    //     .paginate();
    //   const posts = await features.query;
    try {
      const post = await this.generic.find();
      return post;
    } catch (error) {
      throw new HttpException("Unable to create post", 400);
    }
  }

  public async deletePostById(id: Types.ObjectId): Promise<void> {
    try {
      await this.generic.findByIdAndDelete(id);
    } catch (error) {
      throw new HttpException("Unable to delete post", 400);
    }
  }
  public async findPostById(id: Types.ObjectId): Promise<IGeneric | null> {
    try {
      const post = await this.generic.findById(id);
      return post;
    } catch (error) {
      throw new HttpException("Unable to find post", 400);
    }
  }
}

export default GenericService;
