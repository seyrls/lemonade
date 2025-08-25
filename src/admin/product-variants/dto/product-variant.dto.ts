import { Expose } from 'class-transformer';

export class ProductVariantDto {
  @Expose()
    id: string;

  @Expose()
    price: string;

  @Expose()
    is_active: boolean;

  @Expose()
    created_at: Date;

  @Expose()
    updated_at: Date;
}
