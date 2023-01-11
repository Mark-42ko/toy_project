import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { PassportModule } from "@nestjs/passport";
import { UsersModule } from "src/users/users.module";
import { UsersService } from "src/users/users.service";
import { Users, UsersSchema } from "src/users/schemas/users.schema";
import { AuthService } from "./auth.service";
import { LocalStrategy } from "./local.strategy";
import { AuthController } from "./auth.controller";
import { JwtModule } from "@nestjs/jwt";
import { jwtConstants } from "./constants";
import { JwtStrategy } from "./jwt.strategy";

@Module({
  imports: [
    UsersModule,
    PassportModule,
    MongooseModule.forFeature([{ name: Users.name, schema: UsersSchema }]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: "10000s" },
    }),
  ],

  providers: [AuthService, LocalStrategy, UsersService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
