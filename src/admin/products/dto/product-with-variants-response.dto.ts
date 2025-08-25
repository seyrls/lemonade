import { Expose, Type } from 'class-transformer';
import { VariantDto } from '../../variants/dto/variant.dto';

export class ProductWithVariantsResponseDto {
  @Expose()
    id: string;

  @Expose()
    name: string;

  @Expose()
    description: string;

  @Expose()
    image_url: string;

  @Expose()
    is_active: boolean;

  @Expose()
    created_at: Date;

  @Expose()
    updated_at: Date;

  @Expose()
  @Type(() => VariantDto)
    variants: VariantDto[];
}
