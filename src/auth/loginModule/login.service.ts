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
import { ConfigService } from '@nestjs/config';
@Injectable()
export class LoginService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private jwt: JwtService,
    private configService: ConfigService,
  ) {}

  async login(loginDTO: LoginDto) {
    const check = await this.userRepository.findOneBy({
      email: loginDTO.email,
    });

    // check account
    if (!check) {
      throw new NotFoundException('LOGIN.USER.EMAIL IS NOT VALID!');
    }

    const isPasswordCorrect = await bcrypt.compare(
      loginDTO.password,
      check.password,
    );

    if (!isPasswordCorrect) {
      throw new UnauthorizedException('LOGIN.USER.PASSWORD IS NOT VALID!');
    }

    // generate accessToken
    try {
      const accessToken = await this.jwt.signAsync(
        { id: check.id, email: check.email, role: check.role },
        { secret: this.configService.get('JWT_SECRET') },
      );
      return accessToken;
    } catch (error) {
      throw new Error('LOGIN.UNABLE GENERATE TOKEN!');
    }
  }
}
