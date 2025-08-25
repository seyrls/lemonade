import { IsBoolean, IsNumber, IsUUID, IsOptional } from 'class-validator';

export class UpdateProductVariantDto {
  @IsOptional()
  @IsUUID()
    variant_id?: string;

  @IsOptional()
  @IsNumber()
    price?: number;

  @IsOptional()
  @IsBoolean()
    is_active?: boolean;
}
