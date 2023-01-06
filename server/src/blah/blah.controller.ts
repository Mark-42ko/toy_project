import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { Query, UseGuards } from '@nestjs/common/decorators';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { BlahService } from './blah.service';
import { Blah } from './schemas/blah.schema';
import { AddBlah } from './dto/add-blah.dto';
import { AddChat } from './dto/add-chat.dto';

@Controller('blah')
export class BlahController {
  constructor(private blahService: BlahService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  @HttpCode(201)
  async create(@Body() addBlah: AddBlah) {
    return this.blahService.create(addBlah);
  }

  @UseGuards(JwtAuthGuard)
  @Post('findOne')
  async findOne(@Body() addBlahDto: AddBlah) {
    const data = await this.blahService.findOne(addBlahDto);
    return Object.assign({
      data: data,
      statusCode: 200,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Query('email') email: string): Promise<Blah[]> {
    const foundBlahRoom = await this.blahService.findAll(email);
    return Object.assign({
      data: foundBlahRoom,
      statusCode: 200,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post('chatAdd')
  async add(@Body() addChatDto: AddChat) {
    console.log('chatAdd');
    const data = await this.blahService.add(addChatDto);
    return Object.assign({
      data: data,
      statusCode: 200,
    });
  }
}
