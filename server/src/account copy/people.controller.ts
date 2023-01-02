import { Body, Controller, Get, HttpCode, Post, Query } from '@nestjs/common';
import { PeopleService } from './people.service';
import { AddPeople } from './dto/add-people.dto';
import { People } from './schemas/people.schema';

@Controller('people')
export class PeopleController {
  constructor(private peopleService: PeopleService) {}

  @Post('add')
  @HttpCode(201)
  async create(@Body() addPeopleDto: AddPeople) {
    this.peopleService.create(addPeopleDto);
  }

  @Get()
  async findAll(): Promise<AddPeople[]> {
    return this.peopleService.findAll();
  }

  @Get('emailCheck')
  async findOne(@Query('email') email: string): Promise<People> {
    const foundEmail = await this.peopleService.findOne(email);
    return Object.assign({
      data: foundEmail,
      statusCode: 200,
    });
  }
}
