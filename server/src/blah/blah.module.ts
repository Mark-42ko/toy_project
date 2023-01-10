import { Module } from "@nestjs/common";
import { BlahService } from "./blah.service";
import { BlahController } from "./blah.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Blah, BlahSchema } from "./schemas/blah.schema";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "src/auth/jwt.strategy";
import { jwtConstants } from "src/auth/constants";
import { BlahGateway } from "./blah.gateway";
import { MulterModule } from "@nestjs/platform-express";
import { multerOptionsFactory } from "src/common/utils/multer.options.factory";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Blah.name, schema: BlahSchema }]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: "6000s" },
    }),
    BlahModule,
    MulterModule.registerAsync({
      useFactory: multerOptionsFactory,
    }),
  ],
  providers: [BlahService, JwtStrategy, BlahGateway],
  controllers: [BlahController],
})
export class BlahModule {}
