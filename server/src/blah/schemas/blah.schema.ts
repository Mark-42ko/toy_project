import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, PromiseProvider } from "mongoose";

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
      profile: string | undefined;
      comments: string;
      date: Date;
      counts: [string];
      filePath: string;
      filename: string;
      filesize: number;
    },
  ];

  @Prop({ required: true })
  status: string;
}

export const BlahSchema = SchemaFactory.createForClass(Blah);
