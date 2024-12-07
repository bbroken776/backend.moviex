import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Patch, Post, Put, Request, UseGuards } from '@nestjs/common';

import { AdminGuard } from 'src/guards/admin.guard';
import { JwtAuthGuard } from '../../guards/jwt.guard';
import { UsersService } from './users.service';

import { CreateUserDTO } from 'src/dtos/users/create-user.dto';
import responseHelper from 'src/helpers/responde.helper';
import { UserDTO } from 'src/dtos/users/user.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@Request() req) {
    const user = await this.usersService.findByEmail(req.user.email);
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    return responseHelper(HttpStatus.OK, 'User found', { user });
  }

  @Get(':id')
  @UseGuards(AdminGuard)
  async findById(@Param('id') id: number) {
    const user = await this.usersService.findById(id);
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    return responseHelper(HttpStatus.OK, 'User found', { user });
  }

  @Get()
  @UseGuards(AdminGuard)
  async findAll() {
    const users = await this.usersService.findAll();
    if (!users || users.length === 0) throw new HttpException('No users found', HttpStatus.NOT_FOUND);
    return responseHelper(HttpStatus.OK, 'Users found', { users });
  }

  @Post()
  async create(@Body() createUserDTO: CreateUserDTO) {
    const user = await this.usersService.create(createUserDTO);
    return responseHelper(HttpStatus.CREATED, 'User created successfully', { user });
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  async update(@Param('id') id: number, @Body() userDTO: Partial<UserDTO>) {
    const user = await this.usersService.update(id, userDTO);
    return responseHelper(HttpStatus.OK, 'User updated successfully', { user });
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  async delete(@Param('id') id: number) {
    const user = await this.usersService.delete(id);
    return responseHelper(HttpStatus.OK, 'User deleted successfully', { user });
  }
}