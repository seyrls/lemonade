import { Expose, Transform } from 'class-transformer';

export class ProductResponseDto {
  @Expose()
    id: string;

  @Expose()
    name: string;

  @Expose()
    description?: string;

  @Expose()
    image_url?: string;

  @Expose()
    is_active: boolean;

  @Expose()
  @Transform(({ value }) => {
    if (value instanceof Date) {
      return value.toISOString();
    }
    return value;
  })
    created_at: Date;

  @Expose()
  @Transform(({ value }) => {
    if (value instanceof Date) {
      return value.toISOString();
    }
    return value;
  })
    updated_at: Date;
}
