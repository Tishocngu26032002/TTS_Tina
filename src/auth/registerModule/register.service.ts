import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../users/entities/user.entity';
import { CreateUserDto } from '../../users/dto/create-user.dto';
import { Repository } from 'typeorm';
import { authenticator } from 'otplib';
import * as nodemailer from 'nodemailer';
import * as bcrypt from 'bcrypt';
import { VerifyDto } from '../../users/dto/verify.dto';

@Injectable()
export class VerifyOTP {
  constructor(
    @InjectRepository(User) private readonly userRepositotry: Repository<User>,
  ) {}

  async create(createUserDTO: CreateUserDto) {
    function sendEmail(email): any {
      const secret = email;
      authenticator.options = { digits: 6, step: 60 };
      const token = authenticator.generate(secret);
      // send otp by email
      const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'nvt2632002work@gmail.com',
          pass: 'qdgx khkr vbki hozr',
        },
      });

      const mailOptions = {
        from: 'nvt2632002work@gmail.com',
        to: email,
        subject: 'OTP Regiter Account',
        text: `Your OTP (It is expired after 1 min) : ${token}`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return {
            success: false,
            email: '',
            errmessage: 'Email send failed!',
          };
        }
      });
      return true;
    }
    // user exists?
    const chechExists = await this.userRepositotry.findOneBy({
      email: createUserDTO.email,
    });
    // throw error exsist
    if (chechExists && chechExists.active) {
      return {
        success: false,
        email: '',
        errmessage: 'Account exists!',
      };
    }

    if (chechExists && !chechExists.active) {
      sendEmail(chechExists.email);
      return {
        success: false,
        email: chechExists.email,
        errmessage: 'Account exists! Please enter OTP verify!',
      };
    }

    // hashPassword
    const hashPassword = await bcrypt.hash(createUserDTO.password, 10);
    createUserDTO.password = hashPassword;
    console.log(createUserDTO.password);
    // insert into db
    const user = this.userRepositotry.create(createUserDTO);
    const check = await this.userRepositotry.save(user);
    let email = null;
    // check action insert
    if (!check) {
      throw new Error('Occur error when save user to db');
    }
    // send email OTP
    email = check.email;
    sendEmail(email);
    return {
      success: true,
      email: check.email,
      errmessage: '',
    };
  }

  async update(verifyDTO: VerifyDto) {
    console.log(verifyDTO);
    const token = verifyDTO.otp;
    const secret = verifyDTO.email;

    authenticator.options = { digits: 6, step: 60 };
    const verify = authenticator.verify({ token, secret });

    console.log(verify);
    if (!verify) {
      throw new Error('otp expire!');
    }

    const check = await this.userRepositotry.update(
      { email: secret },
      { active: true },
    );

    if (!check) {
      throw new Error('update active false!');
    }

    return {
      success: true,
    };
  }
}
