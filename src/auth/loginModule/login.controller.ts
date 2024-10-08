import { Body, Controller, Post } from '@nestjs/common';
import { LoginDto } from '../../users/dto/login.dto';
import { LoginService } from './login.service';
import { responseHandler } from '../../Util/responseUtil';

@Controller('login')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}
  @Post()
  async login(@Body() loginDTO: LoginDto) {
    try {
      const access = await this.loginService.login(loginDTO);
      return responseHandler.ok(access);
    } catch (err) {
      return responseHandler.unauthorized(err.message);
    }
  }
}
