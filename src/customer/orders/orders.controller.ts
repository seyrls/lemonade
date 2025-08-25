import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { API_PATHS } from '../../constants/api-versions';
import { OrdersService } from './orders.service';
import { CreateOrderDto, OrderResponseDto } from './dto';

@Controller(`${API_PATHS.CUSTOMER}/orders`)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get(':confirmation_number')
  async getOrderByConfirmationNumber(
    @Param('confirmation_number', ParseIntPipe) confirmation_number: number,
  ): Promise<OrderResponseDto> {
    return this.ordersService.getOrderByConfirmationNumber(confirmation_number);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createOrder(
    @Body() createOrderDto: CreateOrderDto,
  ): Promise<OrderResponseDto> {
    return this.ordersService.createOrder(createOrderDto);
  }
}
