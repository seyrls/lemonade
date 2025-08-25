import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Product } from './product.entity';
import { Variant } from './variant.entity';
import { OrderItem } from './order-item.entity';

@Entity('product_variants')
export class ProductVariant {
  @PrimaryGeneratedColumn('uuid')
    id: string;

  @Column({ type: 'uuid' })
    product_id: string;

  @Column({ type: 'uuid' })
    variant_id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
    price: number;

  @Column({ type: 'boolean', default: true })
    is_active: boolean;

  @CreateDateColumn()
    created_at: Date;

  @UpdateDateColumn()
    updated_at: Date;

  @ManyToOne(() => Product, (product) => product.productVariants)
  @JoinColumn({ name: 'product_id' })
    product: Product;

  @ManyToOne(() => Variant, (variant) => variant.productVariants)
  @JoinColumn({ name: 'variant_id' })
    variant: Variant;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.productVariant)
    orderItems: OrderItem[];
}
