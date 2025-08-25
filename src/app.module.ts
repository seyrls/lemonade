import { AdminModule } from './admin/admin.module';
import { CustomerModule } from './customer/customer.module';
import { CoreModule } from './core';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { entities } from './entities';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DATABASE_HOST') ?? 'localhost',
        port: configService.get('DATABASE_PORT') ?? 5432,
        username: configService.get('DATABASE_USER') ?? 'lemonade_user',
        password: configService.get('DATABASE_PASSWORD') ?? 'lemonade_password',
        database: configService.get('DATABASE_NAME') ?? 'lemonade',
        entities: entities,
        synchronize:
          configService.get('NODE_ENV') === 'development' ? true : false,
        logging: configService.get('NODE_ENV') === 'development' ? true : false,
        ssl:
          configService.get('NODE_ENV') === 'production'
            ? { rejectUnauthorized: false }
            : false,
      }),
      inject: [ConfigService],
    }),
    CoreModule,
    AdminModule,
    CustomerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
