import { Body, Controller, Get, HttpCode, Post, Query } from "@nestjs/common";
import { PeopleService } from "./people.service";
import { AddPeople } from "./dto/add-people.dto";
import { People } from "./schemas/people.schema";
import { UseGuards } from "@nestjs/common/decorators";
import { JwtAuthGuard } from "src/auth/jwt.guard";

@Controller("people")
export class PeopleController {
  constructor(private peopleService: PeopleService) {}

  @UseGuards(JwtAuthGuard)
  @Post("add")
  @HttpCode(201)
  async add(@Body() addPeopleDto: AddPeople): Promise<any> {
    return this.peopleService.add(addPeopleDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<People[]> {
    return this.peopleService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get("readPeople")
  async findOne(@Query("user") user: string): Promise<People> {
    const foundEmail = await this.peopleService.findOne(user);
    return Object.assign({
      data: foundEmail,
      statusCode: 200,
    });
  }
}
