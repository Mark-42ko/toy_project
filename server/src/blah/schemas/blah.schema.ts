import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BlahDocument = HydratedDocument<Blah>;

@Schema()
export class Blah {
  @Prop({ required: true })
  user: [
    {
      email: string;
      name: string;
      phoneNumber: string;
    },
  ];

  @Prop({})
  blah: [
    {
      name: string;
      comments: string;
    },
  ];
}

export const BlahSchema = SchemaFactory.createForClass(Blah);
