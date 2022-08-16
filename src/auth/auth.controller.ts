import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/auth-login.dto';
import { ApiTags, ApiBody } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiTags('Auth')
  @ApiBody({
    type: AuthLoginDto,
    examples: {
      login: {
        value: {
          email: 'demotest1@mail.com',
          password: 'Abc@123',
        } as AuthLoginDto,
      },
    },
  })
  async login(@Body() authLoginDto: AuthLoginDto) {
    return this.authService.login(authLoginDto);
  }
}
