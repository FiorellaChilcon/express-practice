import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './entity';
import { env } from '../main/config';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: env.database.host,
  port: env.database.port,
  username: env.database.username,
  password: env.database.password,
  database: env.database.name,
  synchronize: true,
  logging: false,
  entities: [User],
  migrations: [],
  subscribers: []
});
