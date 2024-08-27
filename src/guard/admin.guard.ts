import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwt: JwtService,
    private userService: UsersService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // get authorization
    const authorizationHeader = request.headers.authorization;
    // check
    if (!authorizationHeader) {
      throw new Error('Please provide authorizationHeader');
    }

    // get token
    const token = authorizationHeader.split(' ')[1]; // Tách chuỗi và lấy token sau "Bearer "

    // check
    if (!token) {
      throw new Error('Please provide token');
    }

    try {
      // verify token
      const payload = await this.jwt.verifyAsync(token, { secret: 'tuyen' });

      if (!payload) {
        throw new Error('payload of token is not exists!');
      }

      const user = await this.userService.findOne(payload.id);

      console.log();

      if (user.active === false || user.role === 'user') return false;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }
}
