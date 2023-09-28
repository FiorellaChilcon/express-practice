import { normalizePort } from '@/helpers';

export const env = {
  server: {
    port: normalizePort(process.env.PORT || '3000')
  },
  database: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
    host: process.env.POSTGRESQL_HOST || 'localhost',
    port: normalizePort(process.env.DB_PORT || '5432')
  },
  jwt: {
    secretKey: process.env.JWT_SECRET_KEY || 'jwt',
    expiresIn: Number(process.env.JWT_EXPIRES_IN) || 43200 // seconds => 12h
  }
};
