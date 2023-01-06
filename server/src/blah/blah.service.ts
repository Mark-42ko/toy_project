import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Blah, BlahDocument } from './schemas/blah.schema';
import { AddBlah } from './dto/add-blah.dto';
import { AddChat } from './dto/add-chat.dto';

@Injectable()
export class BlahService {
  constructor(@InjectModel(Blah.name) private BlahModel: Model<BlahDocument>) {}

  async create(addBlahDto: AddBlah): Promise<Blah> {
    const result = await this.BlahModel.create({
      user: addBlahDto.user,
      blah: addBlahDto.blah,
    });
    return result.save();
  }

  async add(addChatDto: AddChat): Promise<Blah> {
    const result = await this.BlahModel.findOneAndUpdate({
      id: addChatDto._id,
      $push: { blah: addChatDto.blah },
    }).exec();
    return result;
  }

  async findAll(email: string): Promise<Blah[]> {
    const data = [];
    const result = await this.BlahModel.find({
      user: {
        $elemMatch: { email: email },
      },
    }).exec();
    data.push(...result);
    return data;
  }

  async findOne(addBlahDto: AddBlah): Promise<any> {
    const data = [];
    for (let i = 0; i < addBlahDto.user.length; i++) {
      const result = await this.BlahModel.find({
        user: {
          $elemMatch: { email: addBlahDto.user[i].email },
        },
      }).exec();
      data.push(result);
    }
    // 합집합
    const countData: number[] = [];
    for (let a = 0; a < data.length; a++) {
      countData.push(data[a].length);
    }
    const max = Math.max(...countData);
    const maxIndex = [];
    for (let x = 0; x < countData.length; x++) {
      if (countData[x] === max) {
        maxIndex.push(x);
      }
    }
    const unionData = [];
    for (let y = 0; y < maxIndex.length; y++) {
      unionData.push(...data[y]);
    }
    const union = unionData.filter((item, i) => {
      return (
        unionData.findIndex((item2, j) => {
          return item.id === item2.id;
        }) === i
      );
    });

    let results = false;
    for (let z = 0; z < union.length; z++) {
      if (union[z].user.length === addBlahDto.user.length) {
        const re = union[z].user.filter((item) =>
          addBlahDto.user.some((i) => i.email === item.email),
        );
        if (re.length === addBlahDto.user.length) {
          results = true;
        }
      }
    }
    return results;
  }
}
