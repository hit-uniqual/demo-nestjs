import { BaseEntity } from 'typeorm';
import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto extends BaseEntity {
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsNotEmpty()
  @ApiProperty()
  @MaxLength(20)
  @MinLength(5)
  password: string;

  @IsNotEmpty()
  @MaxLength(50)
  @ApiProperty()
  firstName: string;

  @IsNotEmpty()
  @MaxLength(50)
  @ApiProperty()
  lastName: string;
}
