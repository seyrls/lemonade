import { Equal, Repository } from 'typeorm';
import { Order } from '../../../entities/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { OrderItem } from '../../../entities/order-item.entity';

@Injectable()
export class OrdersRepository {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
  ) {}

  async findOrderByIdWithItems(
    confirmation_number: number,
  ): Promise<Order | null> {
    return this.orderRepository.findOne({
      where: { confirmation_number: Equal(confirmation_number) },
      relations: ['orderItems', 'orderItems.productVariant'],
    });
  }

  async createOrder(orderData: Partial<Order>): Promise<Order> {
    const order = this.orderRepository.create(orderData);
    return this.orderRepository.save(order);
  }

  async createOrderItems(
    orderItems: Partial<OrderItem>[],
  ): Promise<OrderItem[]> {
    const orderItemEntities = orderItems.map(item => 
      this.orderItemRepository.create(item),
    );
    return this.orderItemRepository.save(orderItemEntities);
  }
}
