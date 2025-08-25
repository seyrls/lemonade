import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Patch,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { API_PATHS } from '../../constants/api-versions';
import {
  CreateProductDto,
  ProductWithVariantsResponseDto,
  UpdateProductDto,
} from './dto';
import { Product } from '../../entities/product.entity';
import { TransformInterceptor } from '../../core/interceptors/transform.interceptor';

@Controller(`${API_PATHS.ADMIN}/products`)
@UseInterceptors(ClassSerializerInterceptor)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async getProducts(): Promise<Product[]> {
    return this.productsService.getProducts();
  }

  @Get(':id')
  @UseInterceptors(new TransformInterceptor(ProductWithVariantsResponseDto))
  async getProductById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Product> {
    return this.productsService.getProductById(id);
  }

  @Post()
  async createProduct(
    @Body() createProductDto: CreateProductDto,
  ): Promise<Product> {
    return this.productsService.createProduct(createProductDto);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateProduct(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<void> {
    await this.productsService.updateProduct(id, updateProductDto);
  }

  @Put(':id')
  async upsertProduct(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() createProductDto: CreateProductDto,
  ): Promise<Product> {
    return this.productsService.upsertProduct(id, createProductDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteProduct(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.productsService.deleteProduct(id);
  }
}
