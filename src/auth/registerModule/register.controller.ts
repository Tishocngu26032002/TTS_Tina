import { Body, Controller, Patch, Post } from '@nestjs/common';
import { CreateUserDto } from '../../users/dto/create-user.dto';
import { VerifyOTP } from './register.service';
import { VerifyDto } from '../../users/dto/verify.dto';

@Controller('register')
export class RegisterController {
  constructor(private readonly VerifyOTP: VerifyOTP) {}
  @Post()
  async create(@Body() createUserDTO: CreateUserDto) {
    try {
      const email = await this.VerifyOTP.create(createUserDTO);
      console.log(email);
      return email;
    } catch (err) {
      console.log(err.message);
      return { success: false, error: err.message };
    }
  }

  @Patch()
  async update(@Body() verifyDTO: VerifyDto) {
    try {
      const check = await this.VerifyOTP.update(verifyDTO);
      return check;
    } catch (err) {
      console.log(err);
      return err.message;
    }
  }
}
