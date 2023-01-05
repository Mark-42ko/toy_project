import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { UseGuards } from '@nestjs/common/decorators';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { BlahService } from './blah.service';
import { Blah } from './schemas/blah.schema';
import { AddBlah } from './dto/add-blah.dto';

@Controller('blah')
export class BlahController {
  constructor(private blahService: BlahService) {}

//   @UseGuards(JwtAuthGuard)
//   @Post('add')
//   @HttpCode(201)
//   async add(@Body() addBlahDto: AddBlah) {
//     return this.blahService.add(addBlahDto);
//   }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<Blah[]> {
    return this.blahService.findAll();
  }

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
}
