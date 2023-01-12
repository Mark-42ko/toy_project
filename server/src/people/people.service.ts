import { Injectable } from "@nestjs/common";
import { AddPeople } from "./dto/add-people.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { People, PeopleDocument } from "./schemas/people.schema";

@Injectable()
export class PeopleService {
  constructor(@InjectModel(People.name) private PeopleModel: Model<PeopleDocument>) {}

  async add(addPeopleDto: AddPeople): Promise<People> {
    const result = await this.PeopleModel.findOne({
      user: addPeopleDto.user,
    }).exec();
    if (result !== null) {
      if (result.friend.find((one) => one.email === addPeopleDto.friend.email) === undefined) {
        await this.PeopleModel.findOneAndUpdate(
          {
            user: addPeopleDto.user,
          },
          {
            $push: {
              friend: addPeopleDto.friend,
            },
          },
        ).exec();
        return Object.assign({
          statusCode: 200,
        });
      } else {
        return Object.assign({
          statusCode: 401,
        });
      }
    } else {
      const peopleAccount = await this.PeopleModel.create({
        user: addPeopleDto.user,
        friend: [addPeopleDto.friend],
      });
      return peopleAccount.save();
    }
  }

  async findAll(): Promise<People[]> {
    return this.PeopleModel.find().exec();
  }

  async findOne(user: string): Promise<People> {
    const result = await this.PeopleModel.findOne({ user: user }).exec();
    if (!result) {
      return null;
    }
    return result;
  }
}
