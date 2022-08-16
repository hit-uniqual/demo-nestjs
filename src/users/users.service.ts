import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  async create(createUserDto: CreateUserDto) {
    const ifExist = await this.findByEmail(createUserDto.email);
    if (ifExist) {
      throw new ConflictException(
        'An account already exists with this email address',
      );
    }
    const user = User.create(createUserDto);
    await user.save();

    delete user.password;
    return {
      success: true,
      message: 'User registered successfully',
      data: user,
    };
  }

  async showById(id: number): Promise<User> {
    const user = await User.findOne({
      where: {
        id: id,
      },
    });

    if (!user) {
      throw new ConflictException('Invalid user');
    }

    delete user.password;
    return user;
  }

  async showAll(_page) {
    const page = _page || 1;
    const skip = (page - 1) * 10;
    const [user, total] = await User.findAndCount({ take: 10, skip: skip });

    if (!user) {
      throw new ConflictException('Invalid user');
    }

    return {
      data: user,
      totalCount: total,
      page: page,
    };
  }

  async findByEmail(email: string) {
    return await User.findOne({
      where: {
        email: email,
      },
    });
  }

  async validatePass(
    oldPassword: string,
    newPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(oldPassword, newPassword);
  }

  async changePassword(changePasswordDto: ChangePasswordDto, req) {
    const user = User.findOne({
      where: {
        id: req.user.id,
      },
    });
    if (!user) {
      throw new ConflictException('Invalid user');
    }
    const validate = this.validatePass(
      changePasswordDto.oldPassword,
      (await user).password,
    );
    if (!validate) {
      throw new ConflictException('Old password does not match');
    }
    (await user).password = await bcrypt.hash(changePasswordDto.password, 10);
    return {
      success: true,
      message: 'Password has been changed successfully',
    };
  }
}
