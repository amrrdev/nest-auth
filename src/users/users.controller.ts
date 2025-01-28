import { Controller, Get, Post } from '@nestjs/common';

@Controller()
export class UsersController {
  @Post()
  findAll() {
    return 'hello';
  }
}
