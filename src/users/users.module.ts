import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersSerivce } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersSerivce],
})
export class UsersModule {}
