import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Blah, BlahDocument } from "./schemas/blah.schema";
import { AddBlah } from "./dto/add-blah.dto";
import { AddChat } from "./dto/add-chat.dto";
import { CountUpdate } from "./dto/update-count.dto";
import * as path from "path";
import { Response } from "express";
import { createReadStream } from "fs";
import { NotReadBlah } from "./dto/notRead-blah.dto";
import { StatusBlah } from "./dto/status-blah.dto";
import { AddPartner } from "./dto/add-partner.dto";

@Injectable()
export class BlahService {
  constructor(@InjectModel(Blah.name) private BlahModel: Model<BlahDocument>) {}

  async create(addBlahDto: AddBlah): Promise<Blah> {
    const result = await this.BlahModel.create({
      user: addBlahDto.user,
      blah: addBlahDto.blah,
      status: addBlahDto.status,
    });
    return result.save();
  }

  async add(addChatDto: AddChat): Promise<Blah> {
    const result = await this.BlahModel.findOneAndUpdate(
      { _id: addChatDto._id },
      { $push: { blah: addChatDto.blah } },
      { new: true },
    ).exec();
    return result;
  }

  async findAll(email: string): Promise<Blah[]> {
    const result = await this.BlahModel.find({
      user: {
        $elemMatch: { email: email },
      },
    }).exec();
    return result;
  }

  async findById(id: string): Promise<Blah> {
    const result = await this.BlahModel.findOne({ _id: id }).exec();
    return result;
  }

  async countUpdate(data: CountUpdate): Promise<Blah> {
    const result = await this.BlahModel.findOneAndUpdate(
      { _id: data._id },
      { $pull: { [`blah.${data.idx}.counts`]: { $in: [data.email] } } },
      { new: true },
    ).exec();
    return result;
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

  async notRead(data: NotReadBlah): Promise<number> {
    const result = await this.BlahModel.findOne({ _id: data._id });
    let counts = 0;
    for (let t = 0; t < result.blah.length; t++) {
      for (let g = 0; g < result.blah[t].counts.length; g++) {
        if (result.blah[t].counts[g] === data.email) {
          counts = counts + 1;
        }
      }
    }
    return counts;
  }

  async statusChange(data: StatusBlah): Promise<Blah> {
    const result = await this.BlahModel.findOneAndUpdate(
      { _id: data._id },
      { status: data.status },
    ).exec();
    return result;
  }

  async addPartner(data: AddPartner): Promise<Blah> {
    for (let q = 0; q < data.user.length; q++) {
      await this.BlahModel.findOneAndUpdate(
        { _id: data._id },
        { $push: { user: data.user[q] } },
      ).exec();
    }
    return null;
  }

  async uploadFile(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException("파일이 존재하지 않습니다.");
    }
    return {
      filePath: file.path,
      fileOriginName: file.originalname,
      filename: file.filename,
      filesize: file.size,
    };
  }

  async downloadFile(res: Response, filename) {
    const name = `${filename.split("_")[0]}.${filename.split(".")[1]}`;
    res.set({
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename=${name}`,
    });
    const stream = createReadStream(path.join(process.cwd(), `uploads/${filename}`));
    stream.pipe(res);
  }
}
