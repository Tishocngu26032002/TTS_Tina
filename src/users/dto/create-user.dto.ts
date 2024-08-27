import { IsEmail, IsNotEmpty, IsPhoneNumber, Length } from 'class-validator';
import { Expose } from 'class-transformer';

export class CreateUserDto {
  @IsNotEmpty()
  @Expose()
  name: string;
  @IsNotEmpty()
  @IsPhoneNumber('VN')
  @Expose()
  phone: string;
  @IsNotEmpty()
  @IsEmail()
  @Expose()
  email: string;
  @IsNotEmpty()
  @Length(8, 24)
  password: string;
  @IsNotEmpty()
  @Expose()
  address: string;
  active: boolean;
  @Expose()
  role: string;
}
