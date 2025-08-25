import { Test, TestingModule } from '@nestjs/testing';
import { VariantsService } from '../../../../src/admin/variants/variants.service';
import { VariantsRepository } from '../../../../src/admin/variants/repositories/variants.repository';
import {
  CreateVariantDto,
  UpdateVariantDto,
} from '../../../../src/admin/variants/dto';

describe('VariantsService', () => {
  let service: VariantsService;
  let mockRepository: jest.Mocked<VariantsRepository>;

  beforeEach(async () => {
    const mockRepositoryProvider = {
      provide: VariantsRepository,
      useValue: {
        findAll: jest.fn(),
        findById: jest.fn(),
        createVariant: jest.fn(),
        updateVariant: jest.fn(),
        upsertVariant: jest.fn(),
        deleteVariant: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [VariantsService, mockRepositoryProvider],
    }).compile();

    service = module.get<VariantsService>(VariantsService);
    mockRepository = module.get(VariantsRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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
      mockRepository.findAll.mockResolvedValue(mockVariants);

      const result = await service.getVariants();
      expect(result).toEqual(mockVariants);
      expect(mockRepository.findAll).toHaveBeenCalled();
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
      };
      mockRepository.findById.mockResolvedValue(mockVariant);

      const result = await service.getVariantById(
        '123e4567-e89b-12d3-a456-426614174000',
      );
      expect(result).toEqual(mockVariant);
      expect(mockRepository.findById).toHaveBeenCalledWith(
        '123e4567-e89b-12d3-a456-426614174000',
      );
    });

    it('should throw NotFoundException when variant not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.getVariantById('non-existent')).rejects.toThrow(
        'Variant not found',
      );
      expect(mockRepository.findById).toHaveBeenCalledWith('non-existent');
    });
  });

  describe('createVariant', () => {
    it('should create a new variant', async () => {
      const createVariantDto: CreateVariantDto = {
        name: 'New Variant',
        is_active: true,
      };
      const mockVariant = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        ...createVariantDto,
        created_at: new Date(),
        updated_at: new Date(),
        productVariants: [],
      };
      mockRepository.createVariant.mockResolvedValue(mockVariant);

      const result = await service.createVariant(createVariantDto);
      expect(result).toEqual(mockVariant);
      expect(mockRepository.createVariant).toHaveBeenCalledWith(
        createVariantDto,
      );
    });
  });

  describe('updateVariant', () => {
    it('should update an existing variant', async () => {
      const updateVariantDto: UpdateVariantDto = {
        name: 'Updated Variant',
      };
      const existingVariant = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Old Variant',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
        productVariants: [],
      };
      const updatedVariant = {
        ...existingVariant,
        ...updateVariantDto,
      };

      mockRepository.findById.mockResolvedValue(existingVariant);
      mockRepository.updateVariant.mockResolvedValue(updatedVariant);

      const result = await service.updateVariant(
        '123e4567-e89b-12d3-a456-426614174000',
        updateVariantDto,
      );
      expect(result).toEqual(updatedVariant);
      expect(mockRepository.findById).toHaveBeenCalledWith(
        '123e4567-e89b-12d3-a456-426614174000',
      );
      expect(mockRepository.updateVariant).toHaveBeenCalledWith(
        '123e4567-e89b-12d3-a456-426614174000',
        updateVariantDto,
      );
    });

    it('should throw NotFoundException when variant not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(
        service.updateVariant('non-existent', { name: 'Updated' }),
      ).rejects.toThrow('Variant not found');
      expect(mockRepository.findById).toHaveBeenCalledWith('non-existent');
    });
  });

  describe('deleteVariant', () => {
    it('should delete a variant', async () => {
      mockRepository.deleteVariant.mockResolvedValue(true);

      await service.deleteVariant('123e4567-e89b-12d3-a456-426614174000');
      expect(mockRepository.deleteVariant).toHaveBeenCalledWith(
        '123e4567-e89b-12d3-a456-426614174000',
      );
    });

    it('should throw NotFoundException when variant not found', async () => {
      mockRepository.deleteVariant.mockResolvedValue(false);

      await expect(service.deleteVariant('non-existent')).rejects.toThrow(
        'Variant not found',
      );
      expect(mockRepository.deleteVariant).toHaveBeenCalledWith('non-existent');
    });
  });
});
