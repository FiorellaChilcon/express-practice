import 'reflect-metadata';
import { User } from '@/infra/entity';
import { env } from '@/main/config';

export const dbConfig = {
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
};
