import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Query,
  Req,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import * as swagger from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes } from '@nestjs/swagger';
import { extname } from 'path';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';

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

  @swagger.ApiTags('User')
  @swagger.ApiBearerAuth('BearerAuth')
  @swagger.ApiBody({
    type: ChangePasswordDto,
    examples: {
      changePassword: {
        value: {
          oldPassword: 'Abc@123',
          password: 'Abc@321',
          confirmedPassword: 'Abc@321',
        } as ChangePasswordDto,
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Req() req,
  ) {
    return this.usersService.changePassword(changePasswordDto, req);
  }

  @swagger.ApiTags('Profile Picture')
  @swagger.ApiBearerAuth('BearerAuth')
  @swagger.ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary'
        }
      }
    }
  })
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file',
  {
      storage: diskStorage({
          destination: './public/storage/profilepic', 
          filename: (_req, file, cb) => {
              return cb(null, `${uuidv4()}.${extname(file.originalname)}`)
          }
      })
  }))
  @ApiConsumes("multipart/form-data")
  @Post('profile-pic')
  async updateProfilePic(@UploadedFile('file') file, @Req() req) {
    return this.usersService.updateProfilePic(file, req);
  }
}
