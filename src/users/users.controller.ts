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
import { responseHandler } from '../Util/responseUtil';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('users')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    try {
      const user = this.usersService.create(createUserDto);
      return responseHandler.ok(user);
    } catch (e) {
      return responseHandler.error(e.message);
    }
  }

  @Get(':page/:limit')
  async findAll(@Param('page') page: number, @Param('limit') limit: number) {
    try {
      const users = await this.usersService.findAll(page, limit);
      console.log(users);
      return responseHandler.ok(users);
    } catch (err) {
      return responseHandler.error(err.message);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    try {
      const user = await this.usersService.findOne(id);
      return responseHandler.ok(user);
    } catch (err) {
      return responseHandler.error(err.message);
    }
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    try {
      const user = await this.usersService.update(id, updateUserDto);
      return responseHandler.ok(user);
    } catch (err) {
      return responseHandler.error(err.message);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    try {
      const check = await this.usersService.remove(id);
      return responseHandler.ok(check);
    } catch (err) {
      return responseHandler.error(err.message);
    }
  }
}
