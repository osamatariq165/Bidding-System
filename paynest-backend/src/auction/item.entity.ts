import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Bid } from '../bid/bid.entity';

@Entity()
export class Item {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ type: 'decimal' })
  startingPrice: number;

  @Column()
  duration: number; // seconds

  @Column({ type: 'timestamp' })
  createdAt: Date;

  @OneToMany(() => Bid, (bid) => bid.item)
  bids: Bid[];
}
