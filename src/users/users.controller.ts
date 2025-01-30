import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/user.dto';
import { RefreshTokenDto } from 'src/auth/dtos/refreshToken.dto';

@Controller('users')
export class UsersController {
  
}
