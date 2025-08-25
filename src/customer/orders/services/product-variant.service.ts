import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductVariant } from '../../../entities/product-variant.entity';
import { ProductVariantRepository } from '../repositories/product-variant.repository';

@Injectable()
export class ProductVariantService {
  constructor(
    private readonly productVariantRepository: ProductVariantRepository,
  ) {}

  async getProductVariantsByIds(ids: string[]): Promise<ProductVariant[]> {
    const productVariants = await this.productVariantRepository.findByIds(ids);

    if (!productVariants.length) {
      throw new NotFoundException(
        `Product variant Id ${ids.toString()} not found.`,
      );
    }

    this.validateProductVariants(productVariants);

    return productVariants;
  }

  private validateProductVariants(productVariants: ProductVariant[]) {
    const invalidVariants = productVariants.filter(
      (variant) =>
        !variant.is_active ||
        !variant.product.is_active ||
        !variant.variant.is_active,
    );

    if (invalidVariants.length) {
      throw new NotFoundException(
        `Product ${invalidVariants[0].product.name} (${invalidVariants[0].variant.name}) is not active.`,
      );
    }
  }
}
