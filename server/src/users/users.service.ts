import { Injectable } from "@nestjs/common";
import { CreateUsersDto } from "./dto/create-users.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Users, UsersDocument } from "./schemas/users.schema";

@Injectable()
export class UsersService {
  constructor(@InjectModel(Users.name) private UsersModel: Model<UsersDocument>) {}

  async create(createAccountDto: CreateUsersDto): Promise<Users> {
    const createdAccount = new this.UsersModel(createAccountDto);
    return createdAccount.save();
  }

  async findAll(): Promise<Users[]> {
    return this.UsersModel.find().exec();
  }

  async findOne(username: string): Promise<Users> {
    const result = this.UsersModel.findOne({ email: username }).exec();
    return result;
  }
}
