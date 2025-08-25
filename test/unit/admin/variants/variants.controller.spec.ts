import { Test, TestingModule } from '@nestjs/testing';
import { VariantsController } from '../../../../src/admin/variants/variants.controller';
import { VariantsService } from '../../../../src/admin/variants/variants.service';

describe('VariantsController', () => {
  let controller: VariantsController;
  let mockVariantsService: jest.Mocked<VariantsService>;

  beforeEach(async () => {
    const mockService = {
      getVariants: jest.fn(),
      getVariantById: jest.fn(),
      getVariantIncludingProducts: jest.fn(),
      createVariant: jest.fn(),
      updateVariant: jest.fn(),
      upsertVariant: jest.fn(),
      deleteVariant: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [VariantsController],
      providers: [
        {
          provide: VariantsService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<VariantsController>(VariantsController);
    mockVariantsService = module.get(VariantsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getVariants', () => {
    it('should return an array of variants', async () => {
      const mockVariants = [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          name: 'Variant 1',
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
          productVariants: [],
        },
        {
          id: '123e4567-e89b-12d3-a456-426614174001',
          name: 'Variant 2',
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
          productVariants: [],
        },
      ];
      mockVariantsService.getVariants.mockResolvedValue(mockVariants);

      const result = await controller.getVariants();
      expect(result).toEqual(mockVariants);
      expect(mockVariantsService.getVariants).toHaveBeenCalled();
    });
  });

  describe('getVariantById', () => {
    it('should return a variant by id', async () => {
      const mockVariant = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Variant 1',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
        productVariants: [],
      } as any;
      mockVariantsService.getVariantById.mockResolvedValue(mockVariant);

      const result = await controller.getVariantById(
        '123e4567-e89b-12d3-a456-426614174000',
      );
      expect(result).toEqual(mockVariant);
      expect(mockVariantsService.getVariantById).toHaveBeenCalledWith(
        '123e4567-e89b-12d3-a456-426614174000',
      );
    });
  });

  describe('createVariant', () => {
    it('should create a new variant', async () => {
      const createVariantDto = {
        name: 'New Variant',
        is_active: true,
      };

      const mockVariant = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        ...createVariantDto,
        created_at: new Date(),
        updated_at: new Date(),
        productVariants: [],
      } as any;

      mockVariantsService.createVariant.mockResolvedValue(mockVariant);

      const result = await controller.createVariant(createVariantDto);
      expect(result).toEqual(mockVariant);
      expect(mockVariantsService.createVariant).toHaveBeenCalledWith(
        createVariantDto,
      );
    });
  });

  describe('updateVariant', () => {
    it('should update an existing variant', async () => {
      const updateVariantDto = {
        name: 'Updated Variant',
        is_active: false,
      };

      (mockVariantsService.updateVariant as jest.Mock).mockResolvedValue(
        undefined,
      );

      await controller.updateVariant(
        '123e4567-e89b-12d3-a456-426614174000',
        updateVariantDto,
      );
      expect(mockVariantsService.updateVariant).toHaveBeenCalledWith(
        '123e4567-e89b-12d3-a456-426614174000',
        updateVariantDto,
      );
    });
  });

  describe('upsertVariant', () => {
    it('should upsert a variant', async () => {
      const createVariantDto = {
        name: 'Upserted Variant',
        is_active: true,
      };

      const mockVariant = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        ...createVariantDto,
        created_at: new Date(),
        updated_at: new Date(),
        productVariants: [],
      } as any;

      mockVariantsService.upsertVariant.mockResolvedValue(mockVariant);

      const result = await controller.upsertVariant(
        '123e4567-e89b-12d3-a456-426614174000',
        createVariantDto,
      );
      expect(result).toEqual(mockVariant);
      expect(mockVariantsService.upsertVariant).toHaveBeenCalledWith(
        '123e4567-e89b-12d3-a456-426614174000',
        createVariantDto,
      );
    });
  });

  describe('deleteVariant', () => {
    it('should delete a variant', async () => {
      mockVariantsService.deleteVariant.mockResolvedValue(undefined);

      await controller.deleteVariant('123e4567-e89b-12d3-a456-426614174000');
      expect(mockVariantsService.deleteVariant).toHaveBeenCalledWith(
        '123e4567-e89b-12d3-a456-426614174000',
      );
    });
  });
});
