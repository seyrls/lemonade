export class ProductVariantResponseDto {
  id: string;
  product_id: string;
  variant_id: string;
  price: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export class ProductVariantsResponseDto {
  product_id: string;
  variants: ProductVariantResponseDto[];
  total_variants: number;
}
