import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateOnlineDto } from "./dto/create-online.dto";
import { Online, OnlineDocument } from "./schemas/online.schema";

@Injectable()
export class OnlineService {
  constructor(@InjectModel(Online.name) private OnlineModel: Model<OnlineDocument>) {}

  async create(data: CreateOnlineDto): Promise<Online> {
    const result = await this.OnlineModel.create(data);
    return null;
  }

  async delete(data: CreateOnlineDto): Promise<Online> {
    const result = await this.OnlineModel.findOneAndDelete({ email: data.email }).exec();
    return null;
  }

  async findAll(): Promise<Online[]> {
    const result = await this.OnlineModel.find().exec();
    return result;
  }
}
