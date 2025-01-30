import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/models/user.model';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  public refreshTokens: Set<string> = new Set();

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.findUserByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async login(user: User) {
    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    this.refreshTokens.add(refreshToken);
    return { accessToken, refreshToken };
  }

  async refreshTokensFn(refreshToken: string) {
    if (!this.refreshTokens.has(refreshToken)) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const payload = this.jwtService.verify(refreshToken);
    const newAccessToken = this.jwtService.sign(
      { sub: payload.sub, email: payload.email },
      { expiresIn: '15m' },
    );

    return { accessToken: newAccessToken };
  }

  async logout(refreshToken: string) {
    this.refreshTokens.delete(refreshToken);
  }
}
