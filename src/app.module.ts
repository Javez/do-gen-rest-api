import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { DatabaseModule } from './database/database.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { Dialect } from 'sequelize';
import { User } from './users/models/user.model';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'dev.env',
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('dev', 'prod', 'test', 'provision')
          .default('dev'),
        PORT: Joi.number().port().default(3000),
        SEQUELIZE_DIALECT: Joi.string(),
        SEQUELIZE_HOST: Joi.string(),
        SEQUELIZE_PORT: Joi.number(),
        SEQUELIZE_USERNAME: Joi.string(),
        SEQUELIZE_PASSWORD: Joi.string(),
        SEQUELIZE_DATABASE: Joi.string(),
        JWT_SECRET: Joi.string(),
      }),
    }),
    SequelizeModule.forRoot({
      dialect: process.env.SEQUELIZE_DIALECT as Dialect,
      host: process.env.SEQUELIZE_HOST,
      port: parseInt(process.env.SEQUELIZE_PORT, 10) || 5432,
      username: process.env.SEQUELIZE_USERNAME,
      password: process.env.SEQUELIZE_PASSWORD,
      database: process.env.SEQUELIZE_DATABASE,
      models: [User],
    }),
    AuthModule,
    UsersModule,
    PostsModule,
    DatabaseModule,
  ],
})
export class AppModule {}
