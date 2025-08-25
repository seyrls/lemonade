import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ProductVariant } from './product-variant.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
    id: string;

  @Column({ type: 'varchar', length: 255 })
    name: string;

  @Column({ type: 'text', nullable: true })
    description: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
    image_url: string;

  @Column({ type: 'boolean', default: true })
    is_active: boolean;

  @CreateDateColumn()
    created_at: Date;

  @UpdateDateColumn()
    updated_at: Date;

  @OneToMany(() => ProductVariant, (productVariant) => productVariant.product, {
    cascade: true,
  })
    productVariants: ProductVariant[];
}
