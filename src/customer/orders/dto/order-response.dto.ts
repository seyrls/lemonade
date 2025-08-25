import { OrderStatus } from '../types/order.types';

export class OrderItemResponseDto {
  id: string;
  product_variant_id: string;
  quantity: number;
  created_at: Date;
  updated_at: Date;
}

export class OrderResponseDto {
  id: string;
  user_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  items: OrderItemResponseDto[];
  total_price: number;
  status: OrderStatus;
  confirmation_number: number;
  created_at: Date;
  updated_at: Date;
}
