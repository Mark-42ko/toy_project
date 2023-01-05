import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PeopleModule } from './people/people.module';

// const MONGO_URI = process.env.MONGO_URI;

@Module({
  imports: [
    UsersModule,
    MongooseModule.forRoot(
      'mongodb+srv://study2022:1q2w3e4r@cluster0.ug0hmx4.mongodb.net/?retryWrites=true&w=majority',
      { dbName: 'project' },
    ),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'env' ? '.dev.env' : '.test.env',
      ignoreEnvFile: process.env.NODE_ENV === 'prod',
    }),
    AuthModule,
    PeopleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
