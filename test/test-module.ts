import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { ValidationPipe } from '@nestjs/common';
import { AppController } from '../src/app.controller';
import { AppService } from '../src/app.service';
import { ProductsModule } from '../src/admin/products/products.module';
import { VariantsModule } from '../src/admin/variants/variants.module';
import { ProductVariantsModule } from '../src/admin/product-variants/product-variants.module';
import { OrdersModule } from '../src/customer/orders/orders.module';
import { CoreModule } from '../src/core';
import { entities } from '../src/entities';

export async function createTestingModule(): Promise<TestingModule> {
  return Test.createTestingModule({
    imports: [
      ConfigModule.forRoot({
        isGlobal: true,
        envFilePath: '.env',
      }),
      TypeOrmModule.forRoot({
        type: 'sqlite',
        database: ':memory:',
        entities: entities,
        synchronize: true,
        logging: false,
        dropSchema: true,
      }),
      CoreModule,
      ProductsModule,
      VariantsModule,
      ProductVariantsModule,
      OrdersModule,
    ],
    controllers: [AppController],
    providers: [AppService],
  }).compile();
}

export async function createTestingModuleWithDataSource(): Promise<{
  module: TestingModule;
  dataSource: DataSource;
}> {
  const module = await Test.createTestingModule({
    imports: [
      ConfigModule.forRoot({
        isGlobal: true,
        envFilePath: '.env',
      }),
      TypeOrmModule.forRoot({
        type: 'sqlite',
        database: ':memory:',
        entities: entities,
        synchronize: true,
        logging: false,
        dropSchema: true,
      }),
      CoreModule,
      ProductsModule,
      VariantsModule,
      ProductVariantsModule,
      OrdersModule,
    ],
    controllers: [AppController],
    providers: [AppService],
  }).compile();

  const dataSource = module.get<DataSource>(DataSource);
  return { module, dataSource };
}

export function configureTestApp(app: any): void {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
}
