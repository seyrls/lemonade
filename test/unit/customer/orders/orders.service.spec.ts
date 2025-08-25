import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from '../../../../src/customer/orders/orders.service';
import { OrdersRepository } from '../../../../src/customer/orders/repositories/orders.repository';
import { UserService } from '../../../../src/customer/orders/services/user.service';
import { ProductVariantService } from '../../../../src/customer/orders/services/product-variant.service';
import { DataSource } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { User } from '../../../../src/entities/user.entity';
import { OrderItem } from '../../../../src/entities/order-item.entity';
import { Order } from '../../../../src/entities/order.entity';

describe('OrdersService', () => {
  let service: OrdersService;
  let mockOrderRepository: jest.Mocked<OrdersRepository>;
  let mockUserService: jest.Mocked<UserService>;
  let mockProductVariantService: jest.Mocked<ProductVariantService>;

  beforeEach(async () => {
    const mockOrderRepositoryProvider = {
      findOne: jest.fn(),
      find: jest.fn(),
      createOrder: jest.fn(),
      createOrderItems: jest.fn(),
      findOrderByIdWithItems: jest.fn(),
    };

    const mockUserServiceProvider = {
      getUserById: jest.fn(),
    };

    const mockProductVariantServiceProvider = {
      getProductVariantById: jest.fn(),
      getProductVariantsByIds: jest.fn(),
    };

    const mockDataSourceProvider = {
      createQueryRunner: jest.fn().mockReturnValue({
        connect: jest.fn(),
        startTransaction: jest.fn(),
        manager: {
          save: jest
            .fn()
            .mockResolvedValueOnce({
              id: 'order-uuid',
              user_id: 'user-uuid',
              total_price: 59.98,
              status: 'pending',
              confirmation_number: 123456,
              created_at: new Date(),
              updated_at: new Date(),
              orderItems: [],
              user: {
                id: 'user-uuid',
                name: 'John Doe',
                email: 'john@example.com',
                phone_number: '+1234567890',
              },
            } as any)
            .mockResolvedValueOnce([
              {
                id: 'item-uuid',
                order_id: 'order-uuid',
                product_variant_id: 'variant-uuid',
                quantity: 2,
                created_at: new Date(),
                updated_at: new Date(),
              },
            ] as any[]),
        },
        commitTransaction: jest.fn(),
        rollbackTransaction: jest.fn(),
        release: jest.fn(),
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: OrdersRepository,
          useValue: mockOrderRepositoryProvider,
        },
        {
          provide: UserService,
          useValue: mockUserServiceProvider,
        },
        {
          provide: ProductVariantService,
          useValue: mockProductVariantServiceProvider,
        },
        {
          provide: DataSource,
          useValue: mockDataSourceProvider,
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    mockOrderRepository = module.get(OrdersRepository);
    mockUserService = module.get(UserService);
    mockProductVariantService = module.get(ProductVariantService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createOrder', () => {
    it('should create a new order successfully', async () => {
      // Arrange
      const createOrderDto = {
        customer_id: 'user-uuid',
        items: [
          {
            product_variant_id: 'variant-uuid',
            quantity: 2,
          },
        ],
      };

      const mockProductVariant = {
        id: 'variant-uuid',
        price: 29.99,
        product: { name: 'Test Product' },
        variant: { name: 'Test Variant' },
      } as any;

      const mockUser = {
        id: 'user-uuid',
        name: 'John Doe',
        email: 'john@example.com',
        phone_number: '+1234567890',
      } as unknown as User;

      const mockOrderItems = [
        {
          id: 'item-uuid',
          order_id: 'order-uuid',
          product_variant_id: 'variant-uuid',
          quantity: 2,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ] as OrderItem[];

      mockProductVariantService.getProductVariantsByIds.mockResolvedValue([
        mockProductVariant,
      ]);
      mockUserService.getUserById.mockResolvedValue(mockUser);
      mockOrderRepository.createOrder.mockResolvedValue({
        id: 'order-uuid',
        user_id: 'user-uuid',
        total_price: 59.98,
        status: 'pending',
        confirmation_number: 123456,
        created_at: new Date(),
        updated_at: new Date(),
        orderItems: [],
        user: mockUser,
      } as Order);
      mockOrderRepository.createOrderItems.mockResolvedValue(
        mockOrderItems as OrderItem[],
      );

      // Act
      const result = await service.createOrder(createOrderDto);

      // Assert
      expect(result.id).toBe('order-uuid');
      expect(result.customer_name).toBe('John Doe');
      expect(result.total_price).toBe(59.98);
      expect(result.items).toHaveLength(1);
      expect(
        mockProductVariantService.getProductVariantsByIds,
      ).toHaveBeenCalledWith(['variant-uuid']);
      expect(mockUserService.getUserById).toHaveBeenCalledWith('user-uuid');
    });

    it('should throw error when order has no items', async () => {
      // Arrange
      const createOrderDto = {
        customer_id: 'user-uuid',
        items: [],
      };

      // Act & Assert
      await expect(service.createOrder(createOrderDto)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.createOrder(createOrderDto)).rejects.toThrow(
        'Order must contain at least one item',
      );
    });

    it('should throw error when product variant not found', async () => {
      // Arrange
      const createOrderDto = {
        customer_id: 'user-uuid',
        items: [
          {
            product_variant_id: 'invalid-variant-uuid',
            quantity: 2,
          },
        ],
      };

      mockProductVariantService.getProductVariantsByIds.mockResolvedValue([]);

      // Act & Assert
      await expect(service.createOrder(createOrderDto)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.createOrder(createOrderDto)).rejects.toThrow(
        'Your cart contains an invalid product variant. Please remove the item(s) and try again.',
      );
    });
  });

  describe('getOrderByConfirmationNumber', () => {
    it('should return order by confirmation number', async () => {
      // Arrange
      const mockOrder = {
        id: 'order-uuid',
        user_id: 'user-uuid',
        total_price: 59.98,
        status: 'pending',
        confirmation_number: 123456,
        created_at: new Date(),
        updated_at: new Date(),
        orderItems: [
          {
            id: 'item-uuid',
            product_variant_id: 'variant-uuid',
            quantity: 2,
            created_at: new Date(),
            updated_at: new Date(),
          },
        ],
      } as Order;

      const mockUser = {
        id: 'user-uuid',
        name: 'John Doe',
        email: 'john@example.com',
        phone_number: '+1234567890',
      } as User;

      mockOrderRepository.findOrderByIdWithItems.mockResolvedValue(
        mockOrder as Order,
      );
      mockUserService.getUserById.mockResolvedValue(mockUser as User);

      // Act
      const result = await service.getOrderByConfirmationNumber(123456 as number);

      // Assert
      expect(result.id).toBe('order-uuid');
      expect(result.confirmation_number).toBe(123456);
      expect(result.customer_name).toBe('John Doe');
      expect(mockOrderRepository.findOrderByIdWithItems).toHaveBeenCalledWith(
        123456,
      );
      expect(mockUserService.getUserById).toHaveBeenCalledWith('user-uuid');
    });

    it('should throw error when order not found', async () => {
      // Arrange
      mockOrderRepository.findOrderByIdWithItems.mockResolvedValue(null);

      // Act & Assert
      await expect(
        service.getOrderByConfirmationNumber(999999),
      ).rejects.toThrow(NotFoundException);
      await expect(
        service.getOrderByConfirmationNumber(999999),
      ).rejects.toThrow('Order with confirmation number 999999 was not found');
    });
  });
});
