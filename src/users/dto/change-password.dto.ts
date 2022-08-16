import { BaseEntity } from 'typeorm';
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto extends BaseEntity {
  @ApiProperty()
  @IsNotEmpty()
  public oldPassword: string;

  @IsNotEmpty()
  @ApiProperty()
  @MaxLength(20)
  @MinLength(5)
  password: string;

  @IsNotEmpty()
  @ApiProperty()
  public confirmedPassword: string;
}
