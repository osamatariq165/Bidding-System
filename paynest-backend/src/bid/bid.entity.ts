import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { Item } from '../auction/item.entity';

@Entity()
export class Bid {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Item, (item) => item.bids)
  item: Item;

  @Column({ type: 'decimal' })
  amount: number;

  @CreateDateColumn()
  createdAt: Date;
}
