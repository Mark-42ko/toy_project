import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Blah, BlahDocument } from './schemas/blah.schema';
import { AddBlah } from './dto/add-blah.dto';

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

//   async add(addBlahDto: AddBlah): Promise<Blah> {
//     const result = await this.BlahModel.findOne({
//       email: addBlahDto.user,
//     }).exec();
//     if (result) {
//       if (
//         result.friend.find((one) => one.email === addBlahDto.friend.email) ===
//         undefined
//       ) {
//         await this.BlahModel.findOneAndUpdate({
//           email: addBlahDto.user,
//           $push: {
//             friend: {
//               email: addBlahDto.friend.email,
//               name: addBlahDto.friend.name,
//               phoneNumber: addBlahDto.friend.phoneNumber,
//             },
//           },
//         }).exec();
//         return Object.assign({
//           statusCode: 200,
//         });
//       } else {
//         console.log('yes data');
//         return Object.assign({
//           statusCode: 401,
//         });
//       }
//     } else {
//       const peopleAccount = new this.BlahModel(addBlahDto);
//       return peopleAccount.save();
//     }
//   }

  async findAll(): Promise<Blah[]> {
    return this.BlahModel.find().exec();
  }

  async findOne(addBlahDto: AddBlah): Promise<any> {
    const data = { counts: 0, duplicationData: [] };
    for (let i = 0; i < addBlahDto.user.length; i++) {
      const result = await this.BlahModel.findOne({
        user: {
          $elemMatch: { email: addBlahDto.user[i].email },
        },
      }).exec();
      // console.log(result.user.length);
      if (result !== null) {
        data.counts = result.user.length;
        data.duplicationData.push(addBlahDto.user[i].email);
      } else {
        data.duplicationData.push(null);
      }
    }
    return data;
  }
}
