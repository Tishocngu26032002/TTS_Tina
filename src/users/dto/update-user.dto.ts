import { IsEmail, IsNotEmpty, IsPhoneNumber, Length } from 'class-validator';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  name: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsPhoneNumber('VN')
  @Expose()
  phone: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  @Expose()
  email: string;
  @ApiProperty()
  @IsNotEmpty()
  @Length(8, 24)
  password: string;
  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  address: string;
  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  active: boolean;
  @ApiProperty()
  @Expose()
  role: string;
}
