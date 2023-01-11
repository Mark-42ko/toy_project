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
              friend: {
                email: addPeopleDto.friend.email,
                name: addPeopleDto.friend.name,
                phoneNumber: addPeopleDto.friend.phoneNumber,
                filename: addPeopleDto.friend.filename,
              },
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
        friend: [
          {
            email: addPeopleDto.friend.email,
            name: addPeopleDto.friend.name,
            phoneNumber: addPeopleDto.friend.phoneNumber,
            filename: addPeopleDto.friend.filename,
          },
        ],
      });
      return peopleAccount.save();
    }
  }

  async findAll(): Promise<People[]> {
    return this.PeopleModel.find().exec();
  }

  async findOne(username: string): Promise<People> {
    const result = this.PeopleModel.findOne({ user: username }).exec();
    if (!result) {
      return Object.assign({
        statusCode: 418,
      });
    }
    return result;
  }
}
