import { Module } from "@nestjs/common";
import { PeopleController } from "./people.controller";
import { PeopleService } from "./people.service";
import { MongooseModule } from "@nestjs/mongoose";
import { People, PeopleSchema } from "./schemas/people.schema";
import { JwtStrategy } from "src/auth/jwt.strategy";
import { JwtModule } from "@nestjs/jwt";
import { jwtConstants } from "src/auth/constants";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: People.name, schema: PeopleSchema }]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: "6000s" },
    }),
  ],
  controllers: [PeopleController],
  providers: [PeopleService, JwtStrategy],
})
export class PeopleModule {}
