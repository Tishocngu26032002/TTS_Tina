import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const chechExists = await this.usersRepository.findOneBy({
      email: createUserDto.email,
    });
    // throw error exsist
    if (chechExists?.active) {
      throw new Error('ACCOUNT EXSIST!');
    }

    // hashPassword
    const hashPassword = await bcrypt.hash(createUserDto.password, 10);
    createUserDto.password = hashPassword;

    // insert into db
    const user = this.usersRepository.create(createUserDto);
    const check = await this.usersRepository.save(user);
    // check action insert
    if (!check) {
      throw new Error('OCCUR ERROR WHEN SAVE USER TO DB!');
    }
    return {
      email: check.email,
    };
  }

  async findAll(page: number = 1, limit: number = 10) {
    if (page < 1) {
      throw new Error('PAGE NUMBER MUST BE GREATER THAN 0!');
    }

    if (limit < 1) {
      throw new Error('LIMIT MUST BE GREATER THAN 0!');
    }

    const [users, total] = await this.usersRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });

    if (!users) throw new Error('NO USER!');

    return {
      data: users,
      total,
      page,
      limit,
    };
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOneBy({ id: id });

    if (!user) {
      throw new Error('USER WITH ID ${id} NOT FOUND!');
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new Error(`USER WITH ID ${id} NOT FOUND!`);
    }

    Object.assign(user, updateUserDto);

    const check = await this.usersRepository.save(user);

    if (!check) throw new Error('UPDATE NOT SUCCESS!');

    return user;
  }

  async remove(id: number) {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new Error(`USER WITH ID ${id} NOT FOUND`);
    }

    user.active = false;

    const check = await this.usersRepository.save(user);

    if (!check) throw new Error('REMOVE NOT SUCCESS!');

    return user;
  }
}
