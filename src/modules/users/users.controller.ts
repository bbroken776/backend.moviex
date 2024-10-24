import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';

import { CreateUserDTO } from 'src/dtos/users/create-user.dto';
import { UserDTO } from 'src/dtos/users/user.dto';
import { JwtAuthGuard } from '../../guards/jwt.guard';
import { UsersService } from './users.service';
import { AdminGuard } from 'src/guards/admin.guard';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@Request() req) {
    return this.usersService.findByEmail(req.user.email);
  }

  @Get(':id')
  async findById(id: number): Promise<UserDTO> {
    return await this.usersService.findById(id);
  }

  @Get(':email')
  async findByEmail(email: string): Promise<UserDTO> {
    return await this.usersService.findByEmail(email);
  }

  @Get()
  @UseGuards(AdminGuard)
  async findAll(): Promise<UserDTO[]> {
    return await this.usersService.findAll();
  }

  @Post()
  async create(@Body() createUserDTO: CreateUserDTO): Promise<UserDTO> {
    return await this.usersService.create(createUserDTO);
  }

  @Put(':id')
  async update(
    id: number,
    @Body() createUserDTO: CreateUserDTO,
  ): Promise<UserDTO> {
    return await this.usersService.update(id, createUserDTO);
  }
}
