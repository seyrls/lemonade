import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Order } from './order.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
    id: string;

  @Column({ type: 'varchar', length: 255 })
    name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
    email: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
    phone_number: string;

  @CreateDateColumn()
    created_at: Date;

  @UpdateDateColumn()
    updated_at: Date;

  @OneToMany(() => Order, (order) => order.user)
    orders: Order[];
}
