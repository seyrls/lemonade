import {
  IsUUID,
  IsArray,
  ValidateNested,
  IsNumber,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class OrderItemDto {
  @IsUUID()
    product_variant_id: string;

  @IsNumber()
  @Min(1)
    quantity: number;
}

export class CreateOrderDto {
  @IsUUID()
    customer_id: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
    items: OrderItemDto[];
}
