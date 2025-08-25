import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Variant } from '../../../entities/variant.entity';
import { Repository } from 'typeorm';
import { CreateVariantDto, UpdateVariantDto } from '../dto';

@Injectable()
export class VariantsRepository {
  constructor(
    @InjectRepository(Variant)
    private readonly variantsRepository: Repository<Variant>,
  ) {}

  async findAll(): Promise<Variant[]> {
    return this.variantsRepository.find();
  }

  async findById(id: string): Promise<Variant | null> {
    return this.variantsRepository
      .findOne({
        where: { id },
        relations: ['productVariants', 'productVariants.product'],
      })
      .then((variant: Variant) => ({
        ...variant,
        products: variant.productVariants.map((pv) => ({
          ...pv.product,
          productVariants: [pv],
        })),
      }));
  }

  async createVariant(createVariantDto: CreateVariantDto): Promise<Variant> {
    const variant = this.variantsRepository.create(createVariantDto);
    return this.variantsRepository.save(variant);
  }

  async updateVariant(
    id: string,
    updateVariantDto: UpdateVariantDto,
  ): Promise<Variant> {
    await this.variantsRepository.update(id, updateVariantDto);
    const variant = await this.findById(id);
    if (!variant) {
      throw new Error('Variant not found after update');
    }
    return variant;
  }

  async upsertVariant(
    id: string,
    createVariantDto: CreateVariantDto,
  ): Promise<Variant> {
    await this.variantsRepository.upsert(
      { id, ...createVariantDto },
      { conflictPaths: ['id'] },
    );
    const variant = await this.findById(id);
    if (!variant) {
      throw new Error('Variant not found after upsert');
    }
    return variant;
  }

  async deleteVariant(id: string): Promise<boolean> {
    const result = await this.variantsRepository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
