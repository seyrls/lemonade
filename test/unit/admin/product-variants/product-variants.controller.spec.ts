import { Test, TestingModule } from '@nestjs/testing';
import { ProductVariantsController } from '../../../../src/admin/product-variants/product-variants.controller';
import { ProductVariantsService } from '../../../../src/admin/product-variants/product-variants.service';

describe('ProductVariantsController', () => {
  let controller: ProductVariantsController;
  let mockProductVariantsService: jest.Mocked<ProductVariantsService>;

  beforeEach(async () => {
    const mockService = {
      addVariantsToProduct: jest.fn(),
      updateProductVariant: jest.fn(),
      deleteProductVariant: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductVariantsController],
      providers: [
        {
          provide: ProductVariantsService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<ProductVariantsController>(
      ProductVariantsController,
    );
    mockProductVariantsService = module.get(ProductVariantsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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
        } as any,
      ];

      mockProductVariantsService.addVariantsToProduct.mockResolvedValue(
        mockProductVariants,
      );

      const result = await controller.addVariantsToProduct(
        '123e4567-e89b-12d3-a456-426614174000',
        [],
      );
      expect(result).toEqual(mockProductVariants);
      expect(
        mockProductVariantsService.addVariantsToProduct,
      ).toHaveBeenCalledWith('123e4567-e89b-12d3-a456-426614174000', []);
    });
  });

  describe('updateProductVariant', () => {
    it('should update a product variant', async () => {
      const updateProductVariantDto = {
        price: 15.99,
        is_active: false,
      };

      const mockProductVariant = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        product_id: '123e4567-e89b-12d3-a456-426614174000',
        variant_id: '123e4567-e89b-12d3-a456-426614174001',
        price: 15.99,
        is_active: false,
        created_at: new Date(),
        updated_at: new Date(),
      } as any;

      mockProductVariantsService.updateProductVariant.mockResolvedValue(
        mockProductVariant,
      );

      const result = await controller.updateProductVariant(
        '123e4567-e89b-12d3-a456-426614174000',
        '123e4567-e89b-12d3-a456-426614174001',
        updateProductVariantDto,
      );
      expect(result).toEqual(mockProductVariant);
      expect(
        mockProductVariantsService.updateProductVariant,
      ).toHaveBeenCalledWith(
        '123e4567-e89b-12d3-a456-426614174000',
        '123e4567-e89b-12d3-a456-426614174001',
        updateProductVariantDto,
      );
    });
  });

  describe('deleteProductVariant', () => {
    it('should delete a product variant', async () => {
      mockProductVariantsService.deleteProductVariant.mockResolvedValue(
        undefined,
      );

      await controller.deleteProductVariant(
        '123e4567-e89b-12d3-a456-426614174001',
      );
      expect(
        mockProductVariantsService.deleteProductVariant,
      ).toHaveBeenCalledWith('123e4567-e89b-12d3-a456-426614174001');
    });
  });
});
