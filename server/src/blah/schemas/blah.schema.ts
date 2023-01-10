import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

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
      date: Date;
      counts: [string];
      filePath: string;
      filename: string;
      filesize: number;
    },
  ];
}

export const BlahSchema = SchemaFactory.createForClass(Blah);
