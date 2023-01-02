import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccountModule } from './account/account.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

// const MONGO_URI = process.env.MONGO_URI;

@Module({
  imports: [
    AccountModule,
    MongooseModule.forRoot(
      'mongodb+srv://study2022:1q2w3e4r@cluster0.ug0hmx4.mongodb.net/?retryWrites=true&w=majority',
      { dbName: 'project' },
    ),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'env' ? '.dev.env' : '.test.env',
      ignoreEnvFile: process.env.NODE_ENV === 'prod',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
