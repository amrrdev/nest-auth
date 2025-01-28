import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import jwtConfig from '../config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { REQUEST_USER_KEY } from '../../iam.constants';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfigration: ConfigType<typeof jwtConfig>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException(
        'where is your token, motherfucker, please login again',
      );
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.jwtConfigration.secret,
        issuer: this.jwtConfigration.issuer,
        audience: this.jwtConfigration.audience,
      });
      request[REQUEST_USER_KEY] = payload;
      console.log(request[REQUEST_USER_KEY]);
    } catch {
      throw new UnauthorizedException('token invalid, login again');
    }
    return true;
  }

  extractTokenFromHeader(request: Request): string | undefined {
    const [_, token] = request.headers.authorization?.split(' ') ?? [];
    return token;
  }
}
