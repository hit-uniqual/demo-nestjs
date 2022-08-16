import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as swagger from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @swagger.ApiTags('Auth')
  @swagger.ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: User,
  })
  @swagger.ApiBody({
    type: CreateUserDto,
    examples: {
      login: {
        value: {
          firstName: 'Lorem',
          lastName: 'Ipsum',
          email: 'demotest1@mail.com',
          password: 'Abc@123',
        } as CreateUserDto,
      },
    },
  })
  @Post('register')
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @swagger.ApiTags('User')
  @swagger.ApiBearerAuth('BearerAuth')
  @swagger.ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: User,
  })
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async show(@Param('id') id: string) {
    return this.usersService.showById(+id);
  }

  @swagger.ApiTags('User')
  @swagger.ApiBearerAuth('BearerAuth')
  @swagger.ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: User,
  })
  @swagger.ApiQuery({
    name: 'page',
    required: false,
    type: Number,
  })
  @UseGuards(JwtAuthGuard)
  @Get()
  async showAll(@Query('page') page: number) {
    return this.usersService.showAll(page);
  }
}
