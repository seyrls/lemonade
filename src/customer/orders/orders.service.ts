import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateOrderDto, OrderResponseDto } from './dto';
import { UserService } from './services/user.service';
import { ProductVariantService } from './services/product-variant.service';
import {
  ValidateOrderDto,
  ValidateOrderItemDto,
} from './dto/validate-order.dto';
import { OrderStatus } from './types/order.types';
import { generateConfirmationNumber } from './utils/confirmation-number.util';
import { OrdersRepository } from './repositories/orders.repository';
import { Order } from '../../entities/order.entity';
import { ProductVariant } from '../../entities/product-variant.entity';
import { User } from '../../entities/user.entity';

@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    private readonly userService: UserService,
    private readonly productVariantService: ProductVariantService,
    private readonly dataSource: DataSource,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto): Promise<OrderResponseDto> {
    const { items } = createOrderDto;

    if (!items || items.length === 0) {
      throw new BadRequestException('Order must contain at least one item');
    }

    const validatedOrder = await this.validateCart(createOrderDto);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const order = await this.ordersRepository.createOrder({
        user_id: validatedOrder.customer_id,
        total_price: validatedOrder.total_price,
        status: OrderStatus.PENDING,
        confirmation_number: generateConfirmationNumber(),
      });

      const savedOrder = await queryRunner.manager.save(order);

      const orderItems = await this.ordersRepository.createOrderItems(
        validatedOrder.items.map((item) => ({
          order_id: savedOrder.id,
          product_variant_id: item.product_variant_id,
          quantity: item.quantity,
        })),
      );

      await queryRunner.manager.save(orderItems);

      await queryRunner.commitTransaction();

      const user = await this.userService.getUserById(
        validatedOrder.customer_id,
      );
      return this.buildOrderResponse(savedOrder, user, validatedOrder.items);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getOrderByConfirmationNumber(
    confirmation_number: number,
  ): Promise<OrderResponseDto> {
    const order =
      await this.ordersRepository.findOrderByIdWithItems(confirmation_number);

    if (!order || !order.confirmation_number) {
      throw new NotFoundException(
        `Order with confirmation number ${confirmation_number} was not found`,
      );
    }

    const user = await this.userService.getUserById(order.user_id);

    const items = order.orderItems.map((item) => ({
      id: item.id,
      product_variant_id: item.product_variant_id,
      quantity: item.quantity,
      created_at: item.created_at,
      updated_at: item.updated_at,
    }));

    return this.buildOrderResponse(order, user, items);
  }

  private async validateCart(
    createOrderDto: CreateOrderDto,
  ): Promise<ValidateOrderDto> {
    const { customer_id, items } = createOrderDto;

    const productVariants = await this.validateCartItems(items);

    const validatedItems: ValidateOrderItemDto[] = items.map((item) => {
      const productVariant = productVariants.find(
        (variant) => variant.id === item.product_variant_id,
      );

      if (!productVariant) {
        throw new NotFoundException(
          `Product variant Id ${item.product_variant_id} not found.`,
        );
      }

      const validateOrderItem: ValidateOrderItemDto = {
        product_variant_id: item.product_variant_id,
        quantity: item.quantity,
        price: productVariant.price,
        product_name: productVariant.product.name,
        variant_name: productVariant.variant.name,
        item_total: productVariant.price * item.quantity,
      };

      return validateOrderItem;
    });

    const total_price = validatedItems.reduce(
      (total, item) => total + item.item_total,
      0,
    );

    const validatedCart: ValidateOrderDto = {
      customer_id,
      items: validatedItems,
      total_price,
    };

    return validatedCart;
  }

  private async validateCartItems(items: CreateOrderDto['items']): Promise<ProductVariant[]> {
    const productVariantIds = items.map((item) => item.product_variant_id);
    const productVariants =
      await this.productVariantService.getProductVariantsByIds(
        productVariantIds,
      );

    if (productVariants.length !== productVariantIds.length) {
      throw new BadRequestException(
        'Your cart contains an invalid product variant. Please remove the item(s) and try again.',
      );
    }

    return productVariants;
  }

  private buildOrderResponse(
    order: Order,
    user: User,
    items: ValidateOrderItemDto[] | CreateOrderDto['items'],
  ): OrderResponseDto {
    const orderResponse: OrderResponseDto = {
      id: order.id,
      user_id: order.user_id,
      customer_name: user.name,
      customer_email: user.email,
      customer_phone: user.phone_number,
      items: items.map((item) => ({
        id: item.id || '',
        product_variant_id: item.product_variant_id,
        quantity: item.quantity,
        created_at: item.created_at || new Date(),
        updated_at: item.updated_at || new Date(),
      })),
      total_price: order.total_price,
      status: order.status as OrderStatus,
      confirmation_number: order.confirmation_number,
      created_at: order.created_at,
      updated_at: order.updated_at,
    };

    return orderResponse;
  }
}
