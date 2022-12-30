import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';

@Controller('account')
export class AccountController {
  constructor(private accountService: AccountService) {}

  @Post('signUp')
  @HttpCode(201)
  async create(@Body() createAccountDto: CreateAccountDto) {
    console.log('starting');
    this.accountService.create(createAccountDto);
  }

  @Get()
  async findAll(): Promise<CreateAccountDto[]> {
    return this.accountService.findAll();
  }
}
