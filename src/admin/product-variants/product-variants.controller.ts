import { Body, Controller, Delete, Param, Post, Patch, ParseUUIDPipe } from '@nestjs/common';
import { API_PATHS } from '../../constants/api-versions';
import { ProductVariantsService } from './product-variants.service';
import { ProductVariantAssociationDto } from './dto';

@Controller(`${API_PATHS.ADMIN}/products/:productId/variants`)
export class ProductVariantsController {
  constructor(
    private readonly productVariantsService: ProductVariantsService,
  ) {}

  @Post()
  async addVariantsToProduct(
    @Param('productId') productId: string,
    @Body() createProductVariantsDto: ProductVariantAssociationDto[],
  ) {
    return this.productVariantsService.addVariantsToProduct(
      productId,
      createProductVariantsDto,
    );
  }

  @Patch(':id')
  async updateProductVariant(
    @Param('productId', ParseUUIDPipe) productId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() productVariant: Partial<ProductVariantAssociationDto>,
  ) {
    return this.productVariantsService.updateProductVariant(
      productId,
      id,
      productVariant,
    );
  }

  @Delete(':id')
  async deleteProductVariant(@Param('id', ParseUUIDPipe) id: string) {
    return this.productVariantsService.deleteProductVariant(id);
  }
}
