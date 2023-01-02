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

  async create(addPeopleDto: AddPeople): Promise<People> {
    const peopleAccount = new this.PeopleModel(addPeopleDto);
    return peopleAccount.save();
  }

  async findAll(): Promise<People[]> {
    return this.PeopleModel.find().exec();
  }

  async findOne(email: string): Promise<People> {
    const result = this.PeopleModel.findOne({ email: email }).exec();
    return result;
  }
}
