export class ValidateOrderItemDto {
  product_variant_id: string;
  quantity: number;
  price: number;
  product_name: string;
  variant_name: string;
  item_total: number;
}

export class ValidateOrderDto {
  customer_id: string;
  items: ValidateOrderItemDto[];
  total_price: number;
}
