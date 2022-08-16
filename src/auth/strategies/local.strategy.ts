import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { AuthLoginDto } from '../dto/auth-login.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(AuthLoginDto: AuthLoginDto): Promise<any> {
    const user = await this.authService.validateUser(AuthLoginDto);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
