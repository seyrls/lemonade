import { Injectable, NotFoundException } from '@nestjs/common';
import { InsertResult } from 'typeorm';
import { ProductVariant } from '../../entities/product-variant.entity';
import { ProductsService } from '../products/products.service';
import { ProductVariantAssociationDto, UpdateProductVariantDto } from './dto';
import { ProductVariantsRepository } from './repositories';

@Injectable()
export class ProductVariantsService {
  constructor(
    private readonly productVariantsRepository: ProductVariantsRepository,
    private readonly productsService: ProductsService,
  ) {}

  async addVariantsToProduct(
    productId: string,
    createProductVariantsDto: ProductVariantAssociationDto[],
  ): Promise<ProductVariant[]> {
    const product = await this.productsService.getProductById(productId);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const variantsToInsert = createProductVariantsDto.map((variant) => ({
      ...variant,
      product_id: productId,
    }));

    const result: InsertResult =
      await this.productVariantsRepository.insertVariants(variantsToInsert);

    const insertedVariants = await this.productVariantsRepository.findByIds(
      result.identifiers.map((id) => id.id as string),
    );

    return insertedVariants;
  }

  async updateProductVariant(
    productId: string,
    id: string,
    variantData: UpdateProductVariantDto,
  ): Promise<ProductVariant> {
    const existingProductVariant =
      await this.productVariantsRepository.findByIdAndProductId(id, productId);
    if (!existingProductVariant) {
      throw new NotFoundException('Product variant not found');
    }

    return this.productVariantsRepository.saveProductVariant({
      ...existingProductVariant,
      ...variantData,
    });
  }

  async deleteProductVariant(id: string): Promise<void> {
    const existingProductVariant =
      await this.productVariantsRepository.findById(id);
    if (!existingProductVariant) {
      throw new NotFoundException('Product variant not found');
    }
    await this.productVariantsRepository.removeProductVariant(
      existingProductVariant,
    );
  }
}
