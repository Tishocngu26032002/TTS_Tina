import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
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
    const check = await this.userRepository.findOneBy({
      email: loginDTO.email,
    });

    // check account
    if (!check) {
      throw new NotFoundException('email not valid!');
    }

    const isPasswordCorrect = await bcrypt.compare(
      loginDTO.password,
      check.password,
    );

    if (!isPasswordCorrect) {
      throw new UnauthorizedException('password not valid!');
    }

    // generate accessToken
    try {
      const accessToken = await this.jwt.signAsync(
        { id: check.id, email: check.email, role: check.role },
        { secret: 'tuyen' },
      );
      return { message: 'login successfully!', accesstoken: accessToken };
    } catch (error) {
      console.error('Error generating token:', error);
      throw new Error('Unable to generate token');
    }
  }
}
