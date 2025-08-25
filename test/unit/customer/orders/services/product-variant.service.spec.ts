import { Test, TestingModule } from '@nestjs/testing';
import { ProductVariantService } from '../../../../../src/customer/orders/services/product-variant.service';
import { ProductVariantRepository } from '../../../../../src/customer/orders/repositories/product-variant.repository';
import { NotFoundException } from '@nestjs/common';
import { ProductVariant } from '../../../../../src/entities/product-variant.entity';

describe('ProductVariantService', () => {
  let service: ProductVariantService;
  let mockProductVariantRepository: jest.Mocked<ProductVariantRepository>;

  beforeEach(async () => {
    const mockRepository = {
      findByIds: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductVariantService,
        {
          provide: ProductVariantRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ProductVariantService>(ProductVariantService);
    mockProductVariantRepository = module.get(ProductVariantRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getProductVariantsByIds', () => {
    it('should return product variants when found', async () => {
      const mockProductVariants = [
        {
          id: 'variant-1',
          price: 29.99,
          is_active: true,
          product: {
            id: 'product-1',
            name: 'Test Product',
            is_active: true,
          },
          variant: {
            id: 'variant-1',
            name: 'Test Variant',
            is_active: true,
          },
        },
        {
          id: 'variant-2',
          price: 39.99,
          is_active: true,
          product: {
            id: 'product-2',
            name: 'Test Product 2',
            is_active: true,
          },
          variant: {
            id: 'variant-2',
            name: 'Test Variant 2',
            is_active: true,
          },
        },
      ] as ProductVariant[];

      mockProductVariantRepository.findByIds.mockResolvedValue(
        mockProductVariants,
      );

      const result = await service.getProductVariantsByIds([
        'variant-1',
        'variant-2',
      ]);

      expect(result).toEqual(mockProductVariants);
      expect(mockProductVariantRepository.findByIds).toHaveBeenCalledWith([
        'variant-1',
        'variant-2',
      ]);
    });

    it('should throw NotFoundException when no product variants found', async () => {
      mockProductVariantRepository.findByIds.mockResolvedValue([]);

      await expect(
        service.getProductVariantsByIds(['non-existent']),
      ).rejects.toThrow(NotFoundException);
      await expect(
        service.getProductVariantsByIds(['non-existent']),
      ).rejects.toThrow('Product variant Id non-existent not found.');
      expect(mockProductVariantRepository.findByIds).toHaveBeenCalledWith([
        'non-existent',
      ]);
    });

    it('should throw NotFoundException when product variant is inactive', async () => {
      const mockProductVariants = [
        {
          id: 'variant-1',
          price: 29.99,
          is_active: false,
          product: {
            id: 'product-1',
            name: 'Test Product',
            is_active: true,
          },
          variant: {
            id: 'variant-1',
            name: 'Test Variant',
            is_active: true,
          },
        },
      ] as ProductVariant[];

      mockProductVariantRepository.findByIds.mockResolvedValue(
        mockProductVariants,
      );

      await expect(
        service.getProductVariantsByIds(['variant-1']),
      ).rejects.toThrow(NotFoundException);
      await expect(
        service.getProductVariantsByIds(['variant-1']),
      ).rejects.toThrow('Product Test Product (Test Variant) is not active.');
    });

    it('should throw NotFoundException when product is inactive', async () => {
      const mockProductVariants = [
        {
          id: 'variant-1',
          price: 29.99,
          is_active: true,
          product: {
            id: 'product-1',
            name: 'Test Product',
            is_active: false,
          },
          variant: {
            id: 'variant-1',
            name: 'Test Variant',
            is_active: true,
          },
        },
      ] as ProductVariant[];

      mockProductVariantRepository.findByIds.mockResolvedValue(
        mockProductVariants,
      );

      await expect(
        service.getProductVariantsByIds(['variant-1']),
      ).rejects.toThrow(NotFoundException);
      await expect(
        service.getProductVariantsByIds(['variant-1']),
      ).rejects.toThrow('Product Test Product (Test Variant) is not active.');
    });

    it('should throw NotFoundException when variant is inactive', async () => {
      const mockProductVariants = [
        {
          id: 'variant-1',
          price: 29.99,
          is_active: true,
          product: {
            id: 'product-1',
            name: 'Test Product',
            is_active: true,
          },
          variant: {
            id: 'variant-1',
            name: 'Test Variant',
            is_active: false,
          },
        },
      ] as ProductVariant[];

      mockProductVariantRepository.findByIds.mockResolvedValue(
        mockProductVariants,
      );

      await expect(
        service.getProductVariantsByIds(['variant-1']),
      ).rejects.toThrow(NotFoundException);
      await expect(
        service.getProductVariantsByIds(['variant-1']),
      ).rejects.toThrow('Product Test Product (Test Variant) is not active.');
    });

    it('should handle multiple inactive variants', async () => {
      const mockProductVariants = [
        {
          id: 'variant-1',
          price: 29.99,
          is_active: false,
          product: {
            id: 'product-1',
            name: 'Test Product 1',
            is_active: true,
          },
          variant: {
            id: 'variant-1',
            name: 'Test Variant 1',
            is_active: true,
          },
        },
        {
          id: 'variant-2',
          price: 39.99,
          is_active: true,
          product: {
            id: 'product-2',
            name: 'Test Product 2',
            is_active: false,
          },
          variant: {
            id: 'variant-2',
            name: 'Test Variant 2',
            is_active: true,
          },
        },
      ] as ProductVariant[];

      mockProductVariantRepository.findByIds.mockResolvedValue(
        mockProductVariants,
      );

      await expect(
        service.getProductVariantsByIds(['variant-1', 'variant-2']),
      ).rejects.toThrow(NotFoundException);
      await expect(
        service.getProductVariantsByIds(['variant-1', 'variant-2']),
      ).rejects.toThrow(
        'Product Test Product 1 (Test Variant 1) is not active.',
      );
    });

    it('should call repository with correct IDs', async () => {
      const mockProductVariants = [
        {
          id: 'variant-1',
          price: 29.99,
          is_active: true,
          product: {
            id: 'product-1',
            name: 'Test Product',
            is_active: true,
          },
          variant: {
            id: 'variant-1',
            name: 'Test Variant',
            is_active: true,
          },
        },
      ] as ProductVariant[];

      mockProductVariantRepository.findByIds.mockResolvedValue(
        mockProductVariants,
      );

      await service.getProductVariantsByIds(['variant-1']);

      expect(mockProductVariantRepository.findByIds).toHaveBeenCalledWith([
        'variant-1',
      ]);
      expect(mockProductVariantRepository.findByIds).toHaveBeenCalledTimes(1);
    });
  });
});
