import { Body, Controller, Get, HttpCode, Post, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUsersDto } from './dto/create-users.dto';
import { Users } from './schemas/users.schema';

@Controller('account')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('signUp')
  @HttpCode(201)
  async create(@Body() createAccountDto: CreateUsersDto) {
    this.usersService.create(createAccountDto);
  }

  @Get()
  async findAll(): Promise<CreateUsersDto[]> {
    return this.usersService.findAll();
  }

  @Get('emailCheck')
  async findOne(@Query('email') username: string): Promise<Users> {
    const foundEmail = await this.usersService.findOne(username);
    return Object.assign({
      data: foundEmail,
      statusCode: 200,
    });
  }
}
