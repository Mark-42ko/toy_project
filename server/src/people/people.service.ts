import { Injectable } from '@nestjs/common';
import { AddPeople } from './dto/add-people.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { People, PeopleDocument } from './schemas/people.schema';

@Injectable()
export class PeopleService {
  constructor(
    @InjectModel(People.name) private PeopleModel: Model<PeopleDocument>,
  ) {}

  async add(addPeopleDto: AddPeople): Promise<People> {
    const result = await this.PeopleModel.findOne({
      email: addPeopleDto.user,
    }).exec();
    if (result) {
      if (
        !result.friend.find((one) => one.email === addPeopleDto.friend.email)
      ) {
        console.log('no data');
        await this.PeopleModel.findOneAndUpdate({
          email: addPeopleDto.user,
          $push: { peopleEmail: addPeopleDto.friend.email },
        }).exec();
        return Object.assign({
          statusCode: 200,
        });
      } else {
        console.log('yes data');
        return Object.assign({
          statusCode: 401,
        });
      }
    } else {
      const peopleAccount = new this.PeopleModel(addPeopleDto);
      return peopleAccount.save();
    }
  }

  async findAll(): Promise<People[]> {
    return this.PeopleModel.find().exec();
  }

  async findOne(email: string): Promise<People> {
    const result = this.PeopleModel.findOne({ email: email }).exec();
    return result;
  }
}