import { Test, TestingModule } from '@nestjs/testing';
import { ProductVariantsService } from '../../../../src/admin/product-variants/product-variants.service';
import { ProductVariantsRepository } from '../../../../src/admin/product-variants/repositories/product-variants.repository';
import { ProductsService } from '../../../../src/admin/products/products.service';
import { ProductVariant } from '../../../../src/entities/product-variant.entity';
import { UpdateProductVariantDto } from '../../../../src/admin/product-variants/dto';

describe('ProductVariantsService', () => {
  let service: ProductVariantsService;
  let mockRepository: jest.Mocked<ProductVariantsRepository>;
  let mockProductsService: jest.Mocked<ProductsService>;

  beforeEach(async () => {
    const mockRepositoryProvider = {
      provide: ProductVariantsRepository,
      useValue: {
        insertVariants: jest.fn(),
        findByIds: jest.fn(),
        findById: jest.fn(),
        findByIdAndProductId: jest.fn(),
        saveProductVariant: jest.fn(),
        removeProductVariant: jest.fn(),
      },
    };

    const mockProductsServiceProvider = {
      provide: ProductsService,
      useValue: {
        getProductById: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductVariantsService,
        mockRepositoryProvider,
        mockProductsServiceProvider,
      ],
    }).compile();

    service = module.get<ProductVariantsService>(ProductVariantsService);
    mockRepository = module.get(ProductVariantsRepository);
    mockProductsService = module.get(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addVariantsToProduct', () => {
    it('should add variants to a product', async () => {
      const mockProductVariants = [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          product_id: '123e4567-e89b-12d3-a456-426614174000',
          variant_id: '123e4567-e89b-12d3-a456-426614174001',
          price: 10.99,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        } as ProductVariant,
      ];

      mockProductsService.getProductById.mockResolvedValue({
        id: '123e4567-e89b-12d3-a456-426614174000',
      } as any);

      mockRepository.insertVariants.mockResolvedValue({
        identifiers: [{ id: '123e4567-e89b-12d3-a456-426614174000' }],
        generatedMaps: [],
        raw: [],
      } as any);

      mockRepository.findByIds.mockResolvedValue(mockProductVariants);

      const result = await service.addVariantsToProduct(
        '123e4567-e89b-12d3-a456-426614174000',
        [],
      );
      expect(result).toEqual(mockProductVariants);
      expect(mockRepository.insertVariants).toHaveBeenCalled();
    });

    it('should throw NotFoundException when product not found', async () => {
      mockProductsService.getProductById.mockRejectedValue(
        new Error('Product not found'),
      );

      await expect(
        service.addVariantsToProduct('non-existent', []),
      ).rejects.toThrow('Product not found');
      expect(mockProductsService.getProductById).toHaveBeenCalledWith(
        'non-existent',
      );
    });
  });

  describe('updateProductVariant', () => {
    it('should update a product variant', async () => {
      const updateDto: UpdateProductVariantDto = {
        price: 15.99,
        is_active: false,
      };

      const existingVariant = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        product_id: '123e4567-e89b-12d3-a456-426614174000',
        variant_id: '123e4567-e89b-12d3-a456-426614174001',
        price: 10.99,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      } as ProductVariant;

      const updatedVariant = {
        ...existingVariant,
        ...updateDto,
      };

      mockRepository.findByIdAndProductId.mockResolvedValue(existingVariant);
      mockRepository.saveProductVariant.mockResolvedValue(updatedVariant);

      const result = await service.updateProductVariant(
        '123e4567-e89b-12d3-a456-426614174000',
        '123e4567-e89b-12d3-a456-426614174000',
        updateDto,
      );

      expect(result).toEqual(updatedVariant);
      expect(mockRepository.findByIdAndProductId).toHaveBeenCalledWith(
        '123e4567-e89b-12d3-a456-426614174000',
        '123e4567-e89b-12d3-a456-426614174000',
      );
      expect(mockRepository.saveProductVariant).toHaveBeenCalledWith({
        ...existingVariant,
        ...updateDto,
      });
    });

    it('should throw NotFoundException when product variant not found', async () => {
      mockRepository.findByIdAndProductId.mockResolvedValue(null);

      await expect(
        service.updateProductVariant('product-id', 'variant-id', {
          price: 15.99,
        }),
      ).rejects.toThrow('Product variant not found');
      expect(mockRepository.findByIdAndProductId).toHaveBeenCalledWith(
        'variant-id',
        'product-id',
      );
    });
  });

  describe('deleteProductVariant', () => {
    it('should delete a product variant', async () => {
      const existingVariant = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        product_id: '123e4567-e89b-12d3-a456-426614174000',
        variant_id: '123e4567-e89b-12d3-a456-426614174001',
        price: 10.99,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      } as ProductVariant;

      mockRepository.findById.mockResolvedValue(existingVariant);
      mockRepository.removeProductVariant.mockResolvedValue(undefined);

      await service.deleteProductVariant(
        '123e4567-e89b-12d3-a456-426614174000',
      );

      expect(mockRepository.findById).toHaveBeenCalledWith(
        '123e4567-e89b-12d3-a456-426614174000',
      );
      expect(mockRepository.removeProductVariant).toHaveBeenCalledWith(
        existingVariant,
      );
    });

    it('should throw NotFoundException when product variant not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(
        service.deleteProductVariant('non-existent'),
      ).rejects.toThrow('Product variant not found');
      expect(mockRepository.findById).toHaveBeenCalledWith('non-existent');
    });
  });
});
