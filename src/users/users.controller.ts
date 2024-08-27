import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '../guard/admin.guard';

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    try {
      console.log('create user');
      const user = this.usersService.create(createUserDto);
      return user;
    } catch (e) {
      return e.message;
    }
  }

  @Get(':page/:limit')
  findAll(@Param('page') page: number, @Param('limit') limit: number) {
    try {
      const users = this.usersService.findAll(page, limit);
      return users;
    } catch (e) {
      return e.message;
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    try {
      const user = await this.usersService.findOne(id);
      return user;
    } catch (err) {
      return err.message;
    }
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    try {
      const user = await this.usersService.update(id, updateUserDto);
      return user;
    } catch (e) {
      return e.message;
    }
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    try {
      const check = this.usersService.remove(id);
      return check;
    } catch (e) {
      return e.message;
    }
  }
}
