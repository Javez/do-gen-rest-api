import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from './models/user.model';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDto } from './dtos/user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
  ) {}

  async createUser(
    createUserDto: CreateUserDto
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    return this.userModel.create({
      name: createUserDto.name,
      email: createUserDto.email,
      password: hashedPassword,
    });
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ where: { email } });
  }

  async findUserById(id: number): Promise<User | null> {
    return this.userModel.findByPk(id);
  }

  async getAllUsers(): Promise<User[]> {
    return this.userModel.findAll();
  }
}
