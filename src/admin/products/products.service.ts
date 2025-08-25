import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from '../../entities/product.entity';
import { CreateProductDto, UpdateProductDto } from './dto';
import { ProductsRepository } from './repositories';

@Injectable()
export class ProductsService {
  constructor(private readonly productsRepository: ProductsRepository) {}

  async getProducts(): Promise<Product[]> {
    return this.productsRepository.findAll();
  }

  async getProductById(id: string): Promise<Product> {
    const product = await this.productsRepository.findById(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    return this.productsRepository.createProduct(createProductDto);
  }

  async updateProduct(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const existingProduct = await this.productsRepository.findById(id);
    if (!existingProduct) {
      throw new NotFoundException('Product not found');
    }
    return this.productsRepository.updateProduct(id, updateProductDto);
  }

  async upsertProduct(
    id: string,
    createProductDto: CreateProductDto,
  ): Promise<Product> {
    return this.productsRepository.upsertProduct(id, createProductDto);
  }

  async deleteProduct(id: string): Promise<void> {
    const deleted = await this.productsRepository.deleteProduct(id);
    if (!deleted) {
      throw new NotFoundException('Product not found');
    }
  }
}
