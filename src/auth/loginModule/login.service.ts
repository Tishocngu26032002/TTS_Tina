import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../users/entities/user.entity';
import { Repository } from 'typeorm';
import { LoginDto } from '../../users/dto/login.dto';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class LoginService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private jwt: JwtService,
  ) {}

  async login(loginDTO: LoginDto) {
    console.log('login', loginDTO);
    const hashpassword = await bcrypt.hash(loginDTO.password, 10);
    console.log('login 0');
    const check = await this.userRepository.findOneBy({
      email: loginDTO.email,
      password: hashpassword,
    });
    console.log('login1', check);
    // check account
    if (!check) {
      console.log('error');
      throw new Error('email or password not valid!');
    }

    // generate accessToken
    return {
      accessToken: this.jwt.signAsync({ email: check.email, role: check.role }),
    };
  }
}
