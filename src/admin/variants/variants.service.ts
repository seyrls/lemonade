import { Injectable, NotFoundException } from '@nestjs/common';
import { Variant } from '../../entities/variant.entity';
import { CreateVariantDto, UpdateVariantDto } from './dto';
import { VariantsRepository } from './repositories';

@Injectable()
export class VariantsService {
  constructor(private readonly variantsRepository: VariantsRepository) {}

  async getVariants(): Promise<Variant[]> {
    return this.variantsRepository.findAll();
  }

  async getVariantById(id: string): Promise<Variant> {
    const variant = await this.variantsRepository.findById(id);
    if (!variant) {
      throw new NotFoundException('Variant not found');
    }
    return variant;
  }

  async getVariantIncludingProducts(id: string): Promise<Variant> {
    const variant = await this.variantsRepository.findById(id);
    if (!variant) {
      throw new NotFoundException('Variant not found');
    }

    return variant;
  }

  async createVariant(createVariantDto: CreateVariantDto): Promise<Variant> {
    return this.variantsRepository.createVariant(createVariantDto);
  }

  async updateVariant(
    id: string,
    updateVariantDto: UpdateVariantDto,
  ): Promise<Variant> {
    const existingVariant = await this.variantsRepository.findById(id);
    if (!existingVariant) {
      throw new NotFoundException('Variant not found');
    }
    return this.variantsRepository.updateVariant(id, updateVariantDto);
  }

  async upsertVariant(
    id: string,
    createVariantDto: CreateVariantDto,
  ): Promise<Variant> {
    return this.variantsRepository.upsertVariant(id, createVariantDto);
  }

  async deleteVariant(id: string): Promise<void> {
    const deleted = await this.variantsRepository.deleteVariant(id);
    if (!deleted) {
      throw new NotFoundException('Variant not found');
    }
  }
}
