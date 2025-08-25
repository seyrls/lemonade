import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsUUID,
  IsOptional,
} from 'class-validator';

export class ProductVariantAssociationDto {
  @IsUUID()
  @IsNotEmpty()
    variant_id: string;

  @IsNumber()
  @IsNotEmpty()
    price: number;

  @IsBoolean()
  @IsOptional()
    is_active: boolean = true;
}
