import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../users/entities/user.entity';
import { RegisterController } from './register.controller';
import { VerifyOTP } from './register.service';
import { UsersModule } from '../../users/users.module';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([User])],
  controllers: [RegisterController],
  providers: [ VerifyOTP],
})
export class RegisterModule {}
