import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../guards/jwt.guard';
import { AdminGuard } from 'src/guards/admin.guard';
import { UsersService } from './users.service';
import { UserDTO } from 'src/dtos/users/user.dto';
import { CreateUserDTO } from 'src/dtos/users/create-user.dto';
import responseHelper from 'src/helpers/responde.helper';

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
  async findById(@Param('id') id: number) {
    const user = await this.usersService.findById(id);
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    return responseHelper(HttpStatus.OK, 'User found', { user });
  }

  @Get('email/:email')
  async findByEmail(@Param('email') email: string) {
    const user = await this.usersService.findByEmail(email);
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

  @Put(':id')
  async update(@Param('id') id: number, @Body() createUserDTO: CreateUserDTO) {
    const user = await this.usersService.update(id, createUserDTO);
    return responseHelper(HttpStatus.OK, 'User updated successfully', { user });
  }
}