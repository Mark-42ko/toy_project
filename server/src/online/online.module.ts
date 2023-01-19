import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";
import { MulterModule } from "@nestjs/platform-express";
import { jwtConstants } from "src/auth/constants";
import { JwtStrategy } from "src/auth/jwt.strategy";
import { multerOptionsFactory } from "src/common/utils/multer.options.factory";
import { OnlineController } from "./online.controller";
import { OnlineService } from "./online.service";
import { Online, OnlineSchema } from "./schemas/online.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Online.name, schema: OnlineSchema }]),
    MulterModule.registerAsync({
      useFactory: multerOptionsFactory,
    }),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: "6000s" },
    }),
  ],
  controllers: [OnlineController],
  providers: [OnlineService, JwtStrategy],
})
export class OnlineModule {}
