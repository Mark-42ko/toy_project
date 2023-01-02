import { Body, Controller, Get, HttpCode, Post, Query } from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { Account } from './schemas/account.schema';

@Controller('account')
export class AccountController {
  constructor(private accountService: AccountService) {}

  @Post('signUp')
  @HttpCode(201)
  async create(@Body() createAccountDto: CreateAccountDto) {
    this.accountService.create(createAccountDto);
  }

  @Get()
  async findAll(): Promise<CreateAccountDto[]> {
    return this.accountService.findAll();
  }

  @Get('emailCheck')
  async findOne(@Query('email') email: string): Promise<Account> {
    const foundEmail = await this.accountService.findOne(email);
    return Object.assign({
      data: foundEmail,
      statusCode: 200,
    });
  }
}
