import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductVariant } from '../../entities/product-variant.entity';
import { ProductVariantsController } from './product-variants.controller';
import { ProductVariantsService } from './product-variants.service';
import { ProductsModule } from '../products/products.module';
import { ProductVariantsRepository } from './repositories';

@Module({
  imports: [TypeOrmModule.forFeature([ProductVariant]), ProductsModule],
  controllers: [ProductVariantsController],
  providers: [ProductVariantsService, ProductVariantsRepository],
  exports: [ProductVariantsService],
})
export class ProductVariantsModule {}
