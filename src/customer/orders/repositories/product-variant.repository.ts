import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ProductVariant } from '../../../entities/product-variant.entity';

@Injectable()
export class ProductVariantRepository {
  constructor(
    @InjectRepository(ProductVariant)
    private readonly productVariantRepository: Repository<ProductVariant>,
  ) {}

  async findById(id: string): Promise<ProductVariant | null> {
    return this.productVariantRepository.findOne({
      where: { id },
      select: {
        id: true,
        price: true,
        is_active: true,
        product: {
          id: true,
          name: true,
          is_active: true,
        },
        variant: {
          id: true,
          name: true,
          is_active: true,
        },
      },
      relations: ['product', 'variant'],
    });
  }

  async findByIds(ids: string[]): Promise<ProductVariant[]> {
    return this.productVariantRepository.find({
      where: { id: In(ids) },
      select: {
        id: true,
        price: true,
        is_active: true,
        product: {
          id: true,
          name: true,
          is_active: true,
        },
        variant: {
          id: true,
          name: true,
          is_active: true,
        },
      },
      relations: ['product', 'variant'],
    });
  }
}
