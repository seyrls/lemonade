import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../../../entities/product.entity';
import { Repository } from 'typeorm';
import { CreateProductDto, UpdateProductDto } from '../dto';

@Injectable()
export class ProductsRepository {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async findAll(): Promise<Product[]> {
    return this.productRepository.find();
  }

  async findById(id: string): Promise<Product> {
    return this.productRepository
      .findOne({
        where: { id },
        relations: ['productVariants', 'productVariants.variant'],
      })
      .then((product: Product) => ({
        ...product,
        variants: product?.productVariants.map((pv) => ({
          ...pv.variant,
          productVariants: [pv],
        })),
      }));
  }

  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create(createProductDto);
    return this.productRepository.save(product);
  }

  async updateProduct(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    await this.productRepository.update(id, updateProductDto);
    const product = await this.findById(id);
    if (!product) {
      throw new Error('Product not found after update');
    }
    return product;
  }

  async upsertProduct(
    id: string,
    createProductDto: CreateProductDto,
  ): Promise<Product> {
    await this.productRepository.upsert(
      { id, ...createProductDto },
      { conflictPaths: ['id'] },
    );
    const product = await this.findById(id);
    if (!product) {
      throw new Error('Product not found after upsert');
    }
    return product;
  }

  async deleteProduct(id: string): Promise<boolean> {
    const result = await this.productRepository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
