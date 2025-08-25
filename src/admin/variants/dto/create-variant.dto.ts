import {
  IsNotEmpty,
  IsString,
  IsBoolean,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Expose } from 'class-transformer';

export class CreateVariantDto {
  @IsString()
  @MaxLength(255)
  @Expose()
  @IsNotEmpty()
  @MinLength(1)
    name: string;

  @IsNotEmpty()
  @IsBoolean()
  @Expose()
    is_active: boolean;
}
