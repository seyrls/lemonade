import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from '../../../../src/admin/products/products.service';
import { ProductsRepository } from '../../../../src/admin/products/repositories/products.repository';

describe('ProductsService', () => {
  let service: ProductsService;
  let mockRepository: jest.Mocked<ProductsRepository>;

  beforeEach(async () => {
    const mockRepositoryProvider = {
      provide: ProductsRepository,
      useValue: {
        findAll: jest.fn(),
        findById: jest.fn(),
        createProduct: jest.fn(),
        updateProduct: jest.fn(),
        upsertProduct: jest.fn(),
        deleteProduct: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductsService, mockRepositoryProvider],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    mockRepository = module.get(ProductsRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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
      mockRepository.findAll.mockResolvedValue(mockProducts);

      const result = await service.getProducts();
      expect(result).toEqual(mockProducts);
      expect(mockRepository.findAll).toHaveBeenCalled();
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
      mockRepository.findById.mockResolvedValue(mockProduct);

      const result = await service.getProductById(
        '123e4567-e89b-12d3-a456-426614174000',
      );
      expect(result).toEqual(mockProduct);
      expect(mockRepository.findById).toHaveBeenCalledWith(
        '123e4567-e89b-12d3-a456-426614174000',
      );
    });

    it('should throw NotFoundException when product not found', async () => {
      mockRepository.findById.mockResolvedValue(null as any);

      await expect(service.getProductById('non-existent')).rejects.toThrow(
        'Product not found',
      );
      expect(mockRepository.findById).toHaveBeenCalledWith('non-existent');
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

      mockRepository.createProduct.mockResolvedValue(mockProduct);

      const result = await service.createProduct(createProductDto);
      expect(result).toEqual(mockProduct);
      expect(mockRepository.createProduct).toHaveBeenCalledWith(
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

      const existingProduct = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Old Product',
        description: 'Old Description',
        image_url: 'old-image.jpg',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
        productVariants: [],
      };

      const updatedProduct = {
        ...existingProduct,
        ...updateProductDto,
      };

      mockRepository.findById.mockResolvedValue(existingProduct);
      mockRepository.updateProduct.mockResolvedValue(updatedProduct);

      const result = await service.updateProduct(
        '123e4567-e89b-12d3-a456-426614174000',
        updateProductDto,
      );
      expect(result).toEqual(updatedProduct);
      expect(mockRepository.findById).toHaveBeenCalledWith(
        '123e4567-e89b-12d3-a456-426614174000',
      );
      expect(mockRepository.updateProduct).toHaveBeenCalledWith(
        '123e4567-e89b-12d3-a456-426614174000',
        updateProductDto,
      );
    });

    it('should throw NotFoundException when product not found', async () => {
      mockRepository.findById.mockResolvedValue(null as any);

      await expect(
        service.updateProduct('non-existent', { name: 'Updated' }),
      ).rejects.toThrow('Product not found');
      expect(mockRepository.findById).toHaveBeenCalledWith('non-existent');
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

      mockRepository.upsertProduct.mockResolvedValue(mockProduct);

      const result = await service.upsertProduct(
        '123e4567-e89b-12d3-a456-426614174000',
        createProductDto,
      );
      expect(result).toEqual(mockProduct);
      expect(mockRepository.upsertProduct).toHaveBeenCalledWith(
        '123e4567-e89b-12d3-a456-426614174000',
        createProductDto,
      );
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product', async () => {
      mockRepository.deleteProduct.mockResolvedValue(true);

      await service.deleteProduct('123e4567-e89b-12d3-a456-426614174000');
      expect(mockRepository.deleteProduct).toHaveBeenCalledWith(
        '123e4567-e89b-12d3-a456-426614174000',
      );
    });

    it('should throw NotFoundException when product not found', async () => {
      mockRepository.deleteProduct.mockResolvedValue(false);

      await expect(service.deleteProduct('non-existent')).rejects.toThrow(
        'Product not found',
      );
      expect(mockRepository.deleteProduct).toHaveBeenCalledWith('non-existent');
    });
  });
});
