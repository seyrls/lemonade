import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from '../../../../src/admin/products/products.controller';
import { ProductsService } from '../../../../src/admin/products/products.service';

describe('ProductsController', () => {
  let controller: ProductsController;
  let mockProductsService: jest.Mocked<ProductsService>;

  beforeEach(async () => {
    const mockService = {
      getProducts: jest.fn(),
      getProductById: jest.fn(),
      getProductWithVariants: jest.fn(),
      createProduct: jest.fn(),
      updateProduct: jest.fn(),
      upsertProduct: jest.fn(),
      deleteProduct: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    mockProductsService = module.get(ProductsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getProducts', () => {
    it('should return an array of products', async () => {
      const mockProducts = [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          name: 'Product 1',
          description: 'Description 1',
          image_url: 'image1.jpg',
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
          productVariants: [],
        },
        {
          id: '123e4567-e89b-12d3-a456-426614174001',
          name: 'Product 2',
          description: 'Description 2',
          image_url: 'image2.jpg',
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
          productVariants: [],
        },
      ];
      mockProductsService.getProducts.mockResolvedValue(mockProducts);

      const result = await controller.getProducts();
      expect(result).toEqual(mockProducts);
      expect(mockProductsService.getProducts).toHaveBeenCalled();
    });
  });

  describe('getProductById', () => {
    it('should return a product by id', async () => {
      const mockProduct = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Product 1',
        description: 'Description 1',
        image_url: 'image1.jpg',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
        productVariants: [],
      };
      mockProductsService.getProductById.mockResolvedValue(mockProduct);

      const result = await controller.getProductById(
        '123e4567-e89b-12d3-a456-426614174000',
      );
      expect(result).toEqual(mockProduct);
      expect(mockProductsService.getProductById).toHaveBeenCalledWith(
        '123e4567-e89b-12d3-a456-426614174000',
      );
    });
  });

  describe('createProduct', () => {
    it('should create a new product', async () => {
      const createProductDto = {
        name: 'New Product',
        description: 'New Description',
        image_url: 'new-image.jpg',
        is_active: true,
      };

      const mockProduct = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        ...createProductDto,
        created_at: new Date(),
        updated_at: new Date(),
        productVariants: [],
      };

      mockProductsService.createProduct.mockResolvedValue(mockProduct);

      const result = await controller.createProduct(createProductDto);
      expect(result).toEqual(mockProduct);
      expect(mockProductsService.createProduct).toHaveBeenCalledWith(
        createProductDto,
      );
    });
  });

  describe('updateProduct', () => {
    it('should update an existing product', async () => {
      const updateProductDto = {
        name: 'Updated Product',
        description: 'Updated Description',
      };

      (mockProductsService.updateProduct as jest.Mock).mockResolvedValue(
        undefined,
      );

      await controller.updateProduct(
        '123e4567-e89b-12d3-a456-426614174000',
        updateProductDto,
      );
      expect(mockProductsService.updateProduct).toHaveBeenCalledWith(
        '123e4567-e89b-12d3-a456-426614174000',
        updateProductDto,
      );
    });
  });

  describe('upsertProduct', () => {
    it('should upsert a product', async () => {
      const createProductDto = {
        name: 'Upserted Product',
        description: 'Upserted Description',
        image_url: 'upserted-image.jpg',
        is_active: true,
      };

      const mockProduct = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        ...createProductDto,
        created_at: new Date(),
        updated_at: new Date(),
        productVariants: [],
      };

      mockProductsService.upsertProduct.mockResolvedValue(mockProduct);

      const result = await controller.upsertProduct(
        '123e4567-e89b-12d3-a456-426614174000',
        createProductDto,
      );
      expect(result).toEqual(mockProduct);
      expect(mockProductsService.upsertProduct).toHaveBeenCalledWith(
        '123e4567-e89b-12d3-a456-426614174000',
        createProductDto,
      );
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product', async () => {
      mockProductsService.deleteProduct.mockResolvedValue(undefined);

      await controller.deleteProduct('123e4567-e89b-12d3-a456-426614174000');
      expect(mockProductsService.deleteProduct).toHaveBeenCalledWith(
        '123e4567-e89b-12d3-a456-426614174000',
      );
    });
  });
});
