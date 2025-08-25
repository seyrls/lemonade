import { Expose, Type } from 'class-transformer';
import { ProductVariantDto } from '../../product-variants/dto/product-variant.dto';

export class VariantDto {
  @Expose()
    id: string;

  @Expose()
    name: string;

  @Expose()
    is_active: boolean;

  @Expose()
    created_at: Date;

  @Expose()
    updated_at: Date;

  @Expose({ name: 'productVariants' })
  @Type(() => ProductVariantDto)
    productVariants: ProductVariantDto[];
}
