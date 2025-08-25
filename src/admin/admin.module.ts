import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { ProductVariantsModule } from './product-variants/product-variants.module';
import { VariantsModule } from './variants/variants.module';

@Module({
  imports: [ProductsModule, ProductVariantsModule, VariantsModule],
})
export class AdminModule {}
