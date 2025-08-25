import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { entities } from '../entities';

config();

const configService = new ConfigService();

export default new DataSource({
  type: 'postgres',
  host: configService.get('DATABASE_HOST') ?? 'localhost',
  port: configService.get('DATABASE_PORT') ?? 5432,
  username: configService.get('DATABASE_USER') ?? 'lemonade_user',
  password: configService.get('DATABASE_PASSWORD') ?? 'lemonade_password',
  database: configService.get('DATABASE_NAME') ?? 'lemonade',
  entities: entities,
  migrations: ['src/migrations/*.ts'],
  migrationsTableName: 'migrations',
  synchronize: false,
  logging: configService.get('NODE_ENV') === 'development',
  ssl:
    configService.get('NODE_ENV') === 'production'
      ? { rejectUnauthorized: false }
      : false,
});
