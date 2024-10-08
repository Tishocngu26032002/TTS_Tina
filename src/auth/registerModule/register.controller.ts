import { Body, Controller, Patch, Post } from '@nestjs/common';
import { CreateUserDto } from '../../users/dto/create-user.dto';
import { VerifyOTP } from './register.service';
import { VerifyDto } from '../../users/dto/verify.dto';
import { responseHandler } from '../../Util/responseUtil';

@Controller('register')
export class RegisterController {
  constructor(private readonly VerifyOTP: VerifyOTP) {}
  @Post()
  async create(@Body() createUserDTO: CreateUserDto) {
    try {
      const email = await this.VerifyOTP.create(createUserDTO);
      return responseHandler.ok(email);
    } catch (err) {
      return responseHandler.error(err.message);
    }
  }

  @Patch()
  async update(@Body() verifyDTO: VerifyDto) {
    try {
      const check = await this.VerifyOTP.update(verifyDTO);
      return responseHandler.ok(check);
    } catch (err) {
      return responseHandler.error(err.message);
    }
  }
}
