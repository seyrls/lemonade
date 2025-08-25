import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ProductVariant } from './product-variant.entity';

@Entity('variants')
export class Variant {
  @PrimaryGeneratedColumn('uuid')
    id: string;

  @Column({ type: 'varchar', length: 255 })
    name: string;

  @Column({ type: 'boolean', default: true })
    is_active: boolean;

  @CreateDateColumn()
    created_at: Date;

  @UpdateDateColumn()
    updated_at: Date;

  @OneToMany(() => ProductVariant, (productVariant) => productVariant.variant, {
    cascade: true,
  })
    productVariants: ProductVariant[];
}
