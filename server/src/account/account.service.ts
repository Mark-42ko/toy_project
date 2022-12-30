import { Injectable } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';

@Injectable()
export class AccountService {
  private readonly account: CreateAccountDto[] = [];

  create(account: CreateAccountDto) {
    this.account.push(account);
  }

  findAll(): CreateAccountDto[] {
    return this.account;
  }
}
