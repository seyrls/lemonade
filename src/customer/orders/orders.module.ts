import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { Order } from '../../entities/order.entity';
import { OrderItem } from '../../entities/order-item.entity';
import { ProductVariant } from '../../entities/product-variant.entity';
import { User } from '../../entities/user.entity';
import { UserService } from './services/user.service';
import { ProductVariantService } from './services/product-variant.service';
import { OrdersRepository } from './repositories/orders.repository';
import { ProductVariantRepository } from './repositories/product-variant.repository';
import { UsersRepository } from './repositories/users.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order,
      OrderItem,
      ProductVariant,
      User,
      OrderItem,
    ]),
  ],
  controllers: [OrdersController],
  providers: [
    OrdersService,
    UserService,
    ProductVariantService,
    OrdersRepository,
    ProductVariantRepository,
    UsersRepository,
  ],
  exports: [OrdersService],
})
export class OrdersModule {}
