import { Test, TestingModule } from '@nestjs/testing';
import { ProductVariantRepository } from '../../../../../src/customer/orders/repositories/product-variant.repository';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProductVariant } from '../../../../../src/entities/product-variant.entity';
import { Repository, In } from 'typeorm';

describe('ProductVariantRepository', () => {
  let repository: ProductVariantRepository;
  let mockProductVariantRepository: jest.Mocked<Repository<ProductVariant>>;

  beforeEach(async () => {
    const mockRepository = {
      findOne: jest.fn(),
      find: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductVariantRepository,
        {
          provide: getRepositoryToken(ProductVariant),
          useValue: mockRepository,
        },
      ],
    }).compile();

    repository = module.get<ProductVariantRepository>(ProductVariantRepository);
    mockProductVariantRepository = module.get(
      getRepositoryToken(ProductVariant),
    );
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('findById', () => {
    it('should return a product variant when found', async () => {
      const mockProductVariant = {
        id: 'variant-uuid',
        price: 29.99,
        is_active: true,
        product: {
          id: 'product-uuid',
          name: 'Test Product',
          is_active: true,
        },
        variant: {
          id: 'variant-uuid',
          name: 'Test Variant',
          is_active: true,
        },
      } as ProductVariant;

      mockProductVariantRepository.findOne.mockResolvedValue(
        mockProductVariant,
      );

      const result = await repository.findById('variant-uuid');

      expect(result).toEqual(mockProductVariant);
      expect(mockProductVariantRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'variant-uuid' },
        select: {
          id: true,
          price: true,
          is_active: true,
          product: {
            id: true,
            name: true,
            is_active: true,
          },
          variant: {
            id: true,
            name: true,
            is_active: true,
          },
        },
        relations: ['product', 'variant'],
      });
    });

    it('should return null when product variant not found', async () => {
      mockProductVariantRepository.findOne.mockResolvedValue(null);

      const result = await repository.findById('non-existent');

      expect(result).toBeNull();
      expect(mockProductVariantRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'non-existent' },
        select: {
          id: true,
          price: true,
          is_active: true,
          product: {
            id: true,
            name: true,
            is_active: true,
          },
          variant: {
            id: true,
            name: true,
            is_active: true,
          },
        },
        relations: ['product', 'variant'],
      });
    });

    it('should call repository with correct parameters', async () => {
      const mockProductVariant = {
        id: 'test-variant',
        price: 39.99,
        is_active: true,
        product: {
          id: 'test-product',
          name: 'Test Product',
          is_active: true,
        },
        variant: {
          id: 'test-variant',
          name: 'Test Variant',
          is_active: true,
        },
      } as ProductVariant;

      mockProductVariantRepository.findOne.mockResolvedValue(
        mockProductVariant,
      );

      await repository.findById('test-variant');

      expect(mockProductVariantRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'test-variant' },
        select: {
          id: true,
          price: true,
          is_active: true,
          product: {
            id: true,
            name: true,
            is_active: true,
          },
          variant: {
            id: true,
            name: true,
            is_active: true,
          },
        },
        relations: ['product', 'variant'],
      });
      expect(mockProductVariantRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('findByIds', () => {
    it('should return product variants when found', async () => {
      const mockProductVariants = [
        {
          id: 'variant-1',
          price: 29.99,
          is_active: true,
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
            is_active: true,
          },
          variant: {
            id: 'variant-2',
            name: 'Test Variant 2',
            is_active: true,
          },
        },
      ] as ProductVariant[];

      mockProductVariantRepository.find.mockResolvedValue(mockProductVariants);

      const result = await repository.findByIds(['variant-1', 'variant-2']);

      expect(result).toEqual(mockProductVariants);
      expect(mockProductVariantRepository.find).toHaveBeenCalledWith({
        where: { id: In(['variant-1', 'variant-2']) },
        select: {
          id: true,
          price: true,
          is_active: true,
          product: {
            id: true,
            name: true,
            is_active: true,
          },
          variant: {
            id: true,
            name: true,
            is_active: true,
          },
        },
        relations: ['product', 'variant'],
      });
    });

    it('should return empty array when no product variants found', async () => {
      mockProductVariantRepository.find.mockResolvedValue([]);

      const result = await repository.findByIds(['non-existent']);

      expect(result).toEqual([]);
      expect(mockProductVariantRepository.find).toHaveBeenCalledWith({
        where: { id: In(['non-existent']) },
        select: {
          id: true,
          price: true,
          is_active: true,
          product: {
            id: true,
            name: true,
            is_active: true,
          },
          variant: {
            id: true,
            name: true,
            is_active: true,
          },
        },
        relations: ['product', 'variant'],
      });
    });

    it('should handle single ID array', async () => {
      const mockProductVariant = {
        id: 'single-variant',
        price: 19.99,
        is_active: true,
        product: {
          id: 'single-product',
          name: 'Single Product',
          is_active: true,
        },
        variant: {
          id: 'single-variant',
          name: 'Single Variant',
          is_active: true,
        },
      } as ProductVariant;

      mockProductVariantRepository.find.mockResolvedValue([mockProductVariant]);

      const result = await repository.findByIds(['single-variant']);

      expect(result).toEqual([mockProductVariant]);
      expect(mockProductVariantRepository.find).toHaveBeenCalledWith({
        where: { id: In(['single-variant']) },
        select: {
          id: true,
          price: true,
          is_active: true,
          product: {
            id: true,
            name: true,
            is_active: true,
          },
          variant: {
            id: true,
            name: true,
            is_active: true,
          },
        },
        relations: ['product', 'variant'],
      });
    });

    it('should call repository with correct parameters', async () => {
      const mockProductVariants = [
        {
          id: 'test-variant',
          price: 49.99,
          is_active: true,
          product: {
            id: 'test-product',
            name: 'Test Product',
            is_active: true,
          },
          variant: {
            id: 'test-variant',
            name: 'Test Variant',
            is_active: true,
          },
        },
      ] as ProductVariant[];

      mockProductVariantRepository.find.mockResolvedValue(mockProductVariants);

      await repository.findByIds(['test-variant']);

      expect(mockProductVariantRepository.find).toHaveBeenCalledWith({
        where: { id: In(['test-variant']) },
        select: {
          id: true,
          price: true,
          is_active: true,
          product: {
            id: true,
            name: true,
            is_active: true,
          },
          variant: {
            id: true,
            name: true,
            is_active: true,
          },
        },
        relations: ['product', 'variant'],
      });
      expect(mockProductVariantRepository.find).toHaveBeenCalledTimes(1);
    });
  });
});
