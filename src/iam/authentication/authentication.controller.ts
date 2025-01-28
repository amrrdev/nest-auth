import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { Auth } from './decorators/auth.decorator';
import { AuthType } from './enum/auth-type.enum';

@Controller('auth')
@Auth(AuthType.NONE)
export class AuthenticationController {
  constructor(private readonly authenicationService: AuthenticationService) {}

  @Post('sign-up')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authenicationService.signUp(signUpDto);
  }

  @Post('sign-in')
  @Auth(AuthType.NONE)
  @HttpCode(HttpStatus.OK)
  signIn(@Body() signInDto: SignInDto) {
    return this.authenicationService.signIn(signInDto);
  }
}
