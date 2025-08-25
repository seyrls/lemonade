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
import { User } from './user.entity';
import { OrderItem } from './order-item.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
    id: string;

  @Column({ type: 'uuid' })
    user_id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
    total_price: number;

  @Column({ type: 'varchar', length: 255 })
    status: string;

  @Column({ type: 'integer', unique: true })
    confirmation_number: number;

  @CreateDateColumn()
    created_at: Date;

  @UpdateDateColumn()
    updated_at: Date;

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'user_id' })
    user: User;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
    orderItems: OrderItem[];
}
