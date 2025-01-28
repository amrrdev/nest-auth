import { Controller, Get, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from '../iam/authentication/guards/access-token.guard';

@Controller('coffees')
export class CoffeesController {
  @Get()
  find() {
    return 'all coffee';
  }
}
