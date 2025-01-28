import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersSerivce } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersSerivce],
})
export class UsersModule {}
