import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { responseHandler } from '../Util/responseUtil';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwt: JwtService,
    private userService: UsersService,
    private ConfigService: ConfigService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<any> {
    const request = context.switchToHttp().getRequest();

    // get authorization
    const authorizationHeader = request.headers.authorization;
    // check
    if (!authorizationHeader) {
      return responseHandler.error('GUARD.PLEASE PROVIDE AUTHORIZATIONHEADER!');
    }

    // get token
    const token = authorizationHeader.split(' ')[1]; // Tách chuỗi và lấy token sau "Bearer "

    // check
    if (!token) {
      return responseHandler.error('GUARD.PLEASE PROVIDE TOKEN!');
    }

    try {
      // verify token
      const payload = await this.jwt.verifyAsync(token, {
        secret: this.ConfigService.get('JWT_SECRET'),
      });

      if (!payload) {
        return responseHandler.error('GUARD.PAYLOAD OF TOKEN IS NOT EXISTS!');
      }

      const user = await this.userService.findOne(payload.id);

      if (user.active === false || user.role === 'user') return false;
    } catch (err) {
      console.log(err);
      throw new UnauthorizedException(err.message);
    }
    return true;
  }
}
