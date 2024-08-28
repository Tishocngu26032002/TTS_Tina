import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../users/entities/user.entity';
import { CreateUserDto } from '../../users/dto/create-user.dto';
import { Repository } from 'typeorm';
import { authenticator } from 'otplib';
import * as nodemailer from 'nodemailer';
import * as bcrypt from 'bcrypt';
import { VerifyDto } from '../../users/dto/verify.dto';
import { Account } from '../../Util/configConst';

@Injectable()
export class VerifyOTP {
  constructor(
    @InjectRepository(User) private readonly userRepositotry: Repository<User>,
  ) {}

  async create(createUserDTO: CreateUserDto) {
    function sendEmail(email): any {
      const secret = email;
      authenticator.options = { digits: 6, step: 120 };
      const token = authenticator.generate(secret);
      // send otp by email
      const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: Account.USER,
          pass: Account.PASS,
        },
      });

      const mailOptions = {
        from: Account.USER,
        to: email,
        subject: 'OTP Regiter Account',
        text: `Your OTP (It is expired after 2 min) : ${token}`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          throw new Error('REGISTER.EMAIL SEND FAILED!');
        }
      });
      return true;
    }
    // user exists?
    const chechExists = await this.userRepositotry.findOneBy({
      email: createUserDTO.email,
    });
    // throw error exsist
    if (chechExists?.active) {
      throw new Error('REGISTER.ACCOUNT EXISTS!');
    }

    if (!chechExists?.active) {
      sendEmail(chechExists.email);
      throw new Error('REGISTER.ACCOUNT NOT VERIFY!PLEASE ENTER OTP VERIFY!');
    }

    // hashPassword
    const hashPassword = await bcrypt.hash(createUserDTO.password, 10);
    createUserDTO.password = hashPassword;
    // insert into db
    const user = this.userRepositotry.create(createUserDTO);
    const check = await this.userRepositotry.save(user);
    let email = null;
    // check action insert
    if (!check) {
      throw new Error('REGISTER.OCCUR ERROR WHEN SAVE TO DATABASE!');
    }
    // send email OTP
    email = check.email;
    sendEmail(email);
    return {
      email: check.email,
    };
  }

  async update(verifyDTO: VerifyDto) {
    const token = verifyDTO.otp;
    const secret = verifyDTO.email;

    authenticator.options = { digits: 6, step: 120 };
    const verify = authenticator.verify({ token, secret });

    if (!verify) {
      throw new Error('REGISTER.OTP EXPIRED!');
    }

    const check = await this.userRepositotry.update(
      { email: secret },
      { active: true },
    );

    if (!check) {
      throw new Error('REGISTER.UPDATE ACTIVE FAILED!');
    }

    return true;
  }
}
