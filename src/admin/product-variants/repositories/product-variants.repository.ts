import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductVariant } from '../../../entities/product-variant.entity';
import { Repository, In, InsertResult } from 'typeorm';

@Injectable()
export class ProductVariantsRepository {
  constructor(
    @InjectRepository(ProductVariant)
    private readonly productVariantsRepository: Repository<ProductVariant>,
  ) {}

  async insertVariants(
    variantsToInsert: Partial<ProductVariant>[],
  ): Promise<InsertResult> {
    return this.productVariantsRepository.insert(variantsToInsert);
  }

  async findByIds(ids: string[]): Promise<ProductVariant[]> {
    return this.productVariantsRepository.findBy({
      id: In(ids),
    });
  }

  async findById(id: string): Promise<ProductVariant | null> {
    return this.productVariantsRepository.findOne({
      where: { id },
    });
  }

  async findByIdAndProductId(
    id: string,
    productId: string,
  ): Promise<ProductVariant | null> {
    return this.productVariantsRepository.findOne({
      where: {
        id,
        product_id: productId,
      },
    });
  }

  async saveProductVariant(
    productVariant: Partial<ProductVariant>,
  ): Promise<ProductVariant> {
    return this.productVariantsRepository.save(productVariant);
  }

  async removeProductVariant(productVariant: ProductVariant): Promise<void> {
    await this.productVariantsRepository.remove(productVariant);
  }
}
