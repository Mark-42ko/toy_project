import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "./users/users.module";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module";
import { PeopleModule } from "./people/people.module";
import { BlahModule } from "./blah/blah.module";
import { OnlineModule } from "./online/online.module";
// const MONGO_URI = process.env.MONGO_URI;

@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>("MONGO_URI"),
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: "project",
      }),
    }),
    AuthModule,
    PeopleModule,
    BlahModule,
    OnlineModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
