import {
  IsNotEmpty,
  IsString,
  IsBoolean,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Expose } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  @MaxLength(255)
  @Expose()
  @IsNotEmpty()
  @MinLength(3)
    name: string;

  @IsNotEmpty()
  @MaxLength(255)
  @MinLength(3)
  @Expose()
    description: string;

  @IsNotEmpty()
  @IsUrl()
  @MaxLength(500)
  @MinLength(3)
  @Expose()
    image_url: string;

  @IsNotEmpty()
  @IsBoolean()
  @Expose()
    is_active: boolean;
}
