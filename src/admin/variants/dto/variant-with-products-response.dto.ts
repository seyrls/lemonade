import { Expose, Type } from 'class-transformer';
import { ProductResponseDto } from '../../products/dto/product-response.dto';

export class VariantWithProductsResponseDto {
  @Expose()
    id: string;

  @Expose()
    name: string;

  @Expose()
    is_active: boolean;

  @Expose()
  @Type(() => ProductResponseDto)
    products: ProductResponseDto[];
}
