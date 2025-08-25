import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from '../../../../src/customer/orders/orders.controller';
import { OrdersService } from '../../../../src/customer/orders/orders.service';
import {
  CreateOrderDto,
  OrderResponseDto,
} from '../../../../src/customer/orders/dto';
import { OrderStatus } from '../../../../src/customer/orders/types/order.types';

describe('OrdersController', () => {
  let controller: OrdersController;
  let service: jest.Mocked<OrdersService>;

  beforeEach(async () => {
    const mockService = {
      createOrder: jest.fn(),
      getOrderByConfirmationNumber: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        {
          provide: OrdersService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<OrdersController>(OrdersController);
    service = module.get(OrdersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createOrder', () => {
    it('should create a new order', async () => {
      // Arrange
      const createOrderDto: CreateOrderDto = {
        customer_id: 'user-uuid',
        items: [
          {
            product_variant_id: 'variant-uuid',
            quantity: 2,
          },
        ],
      };

      const expectedResponse: OrderResponseDto = {
        id: 'order-uuid',
        user_id: 'user-uuid',
        customer_name: 'John Doe',
        customer_email: 'john@example.com',
        customer_phone: '+1234567890',
        items: [
          {
            id: 'item-uuid',
            product_variant_id: 'variant-uuid',
            quantity: 2,
            created_at: new Date(),
            updated_at: new Date(),
          },
        ],
        total_price: 59.98,
        status: OrderStatus.PENDING,
        confirmation_number: 123456,
        created_at: new Date(),
        updated_at: new Date(),
      };

      service.createOrder.mockResolvedValue(expectedResponse);

      // Act
      const result = await controller.createOrder(createOrderDto);

      // Assert
      expect(result).toEqual(expectedResponse);
      expect(service.createOrder).toHaveBeenCalledWith(createOrderDto);
    });
  });

  describe('getOrderByConfirmationNumber', () => {
    it('should return order by confirmation number', async () => {
      // Arrange
      const orderId = 123456;
      const expectedResponse: OrderResponseDto = {
        id: 'order-uuid',
        user_id: 'user-uuid',
        customer_name: 'John Doe',
        customer_email: 'john@example.com',
        customer_phone: '+1234567890',
        items: [
          {
            id: 'item-uuid',
            product_variant_id: 'variant-uuid',
            quantity: 2,
            created_at: new Date(),
            updated_at: new Date(),
          },
        ],
        total_price: 59.98,
        status: OrderStatus.PENDING,
        confirmation_number: 123456,
        created_at: new Date(),
        updated_at: new Date(),
      };

      service.getOrderByConfirmationNumber.mockResolvedValue(expectedResponse);

      // Act
      const result = await controller.getOrderByConfirmationNumber(orderId);

      // Assert
      expect(result).toEqual(expectedResponse);
      expect(service.getOrderByConfirmationNumber).toHaveBeenCalledWith(
        orderId,
      );
    });

    it('should handle service errors', async () => {
      // Arrange
      const orderId = 999999;
      service.getOrderByConfirmationNumber.mockRejectedValue(
        new Error('Order not found'),
      );

      // Act & Assert
      await expect(
        controller.getOrderByConfirmationNumber(orderId),
      ).rejects.toThrow('Order not found');
      expect(service.getOrderByConfirmationNumber).toHaveBeenCalledWith(
        orderId,
      );
    });
  });
});
