import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PeopleDocument = HydratedDocument<People>;

@Schema()
export class People {
  @Prop({ required: true })
  user: string;

  @Prop({ required: true })
  peopleEmail: string;

  @Prop({ required: true })
  name: string;
}

export const PeopleSchema = SchemaFactory.createForClass(People);
