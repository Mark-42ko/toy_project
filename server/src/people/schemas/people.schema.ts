import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type PeopleDocument = HydratedDocument<People>;

@Schema()
export class People {
  @Prop({ required: true })
  user: string;

  @Prop({})
  friend: [
    {
      email: string;
      name: string;
      phoneNumber: string;
      filename: string;
      date: Date;
    },
  ];
}

export const PeopleSchema = SchemaFactory.createForClass(People);
