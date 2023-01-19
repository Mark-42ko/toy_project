import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type OnlineDocument = HydratedDocument<Online>;

@Schema()
export class Online {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  phoneNumber: string;

  @Prop({})
  filename: string;
}

export const OnlineSchema = SchemaFactory.createForClass(Online);
