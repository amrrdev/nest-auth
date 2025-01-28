import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../users/entities/users.entity';
import { Repository } from 'typeorm';
import { HashingService } from '../hashing/hashing.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from './config/jwt.config';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectRepository(User) private readonly UserRepository: Repository<User>,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfigration: ConfigType<typeof jwtConfig>,
  ) {}

  async signIn(signInDto: SignInDto) {
    const user = await this.UserRepository.findOneBy({
      email: signInDto.email,
    });

    if (!user) {
      throw new UnauthorizedException('User does not exists');
    }
    if (
      !(await this.hashingService.compare(signInDto.password, user.password))
    ) {
      throw new UnauthorizedException('Password does not match');
    }

    const accessToken = this.jwtService.sign(
      { sub: user.id, email: user.email },
      {
        secret: this.jwtConfigration.secret,
        expiresIn: this.jwtConfigration.accessTokenTtl,
        issuer: this.jwtConfigration.issuer,
        audience: this.jwtConfigration.audience,
      },
    );
    return {
      accessToken,
    };
  }

  async signUp(signUpDto: SignUpDto) {
    try {
      const newUser = this.UserRepository.create();

      Object.assign(newUser, {
        ...signUpDto,
        password: await this.hashingService.hash(signUpDto.password),
      });

      await this.UserRepository.save(newUser);
    } catch (err) {
      const PG_UNIQUE_VIOLATION_ERROR_CODE = '23505';
      const PG_CHECK_VIOLATION_ERROR_CODE = '23514';

      if (
        err.code === PG_UNIQUE_VIOLATION_ERROR_CODE ||
        err.code === PG_CHECK_VIOLATION_ERROR_CODE
      ) {
        throw new ConflictException('Email or username already exists');
      }
    }
  }
}
