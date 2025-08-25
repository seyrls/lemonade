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
import { API_PATHS } from '../../constants/api-versions';
import {
  CreateVariantDto,
  UpdateVariantDto,
  VariantWithProductsResponseDto,
} from './dto';
import { TransformInterceptor } from '../../core/interceptors/transform.interceptor';
import { Variant } from '../../entities/variant.entity';
import { VariantsService } from './variants.service';

@Controller(`${API_PATHS.ADMIN}/variants`)
@UseInterceptors(ClassSerializerInterceptor)
export class VariantsController {
  constructor(private readonly variantsService: VariantsService) {}

  @Get()
  async getVariants(): Promise<Variant[]> {
    return this.variantsService.getVariants();
  }

  @Get(':id')
  @UseInterceptors(new TransformInterceptor(VariantWithProductsResponseDto))
  async getVariantById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Variant> {
    return this.variantsService.getVariantById(id);
  }

  @Post()
  async createVariant(
    @Body() createVariantDto: CreateVariantDto,
  ): Promise<Variant> {
    return this.variantsService.createVariant(createVariantDto);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateVariant(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateVariantDto: UpdateVariantDto,
  ): Promise<void> {
    await this.variantsService.updateVariant(id, updateVariantDto);
  }

  @Put(':id')
  async upsertVariant(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() createVariantDto: CreateVariantDto,
  ): Promise<Variant> {
    return this.variantsService.upsertVariant(id, createVariantDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteVariant(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.variantsService.deleteVariant(id);
  }
}
