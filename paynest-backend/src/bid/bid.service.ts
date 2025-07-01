import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository, InjectDataSource  } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Bid } from './bid.entity';
import { Item } from '../auction/item.entity';
import { User } from '../user/user.entity';
import { BidGateway } from './bid.gateway';

@Injectable()
export class BidService {
  constructor(
    @InjectRepository(Bid)
    private readonly bidRepository: Repository<Bid>,
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly bidGateway: BidGateway,
    @InjectDataSource() private dataSource: DataSource
  ) {}

  async placeBid(itemId: number, userId: number, amount: number): Promise<Bid> {
    return this.dataSource.transaction(async manager => {
      // Lock the item row to prevent concurrent modifications
      const item = await manager.findOne(this.itemRepository.target, {
        where: { id: itemId },
        relations: ['bids'],
        lock: { mode: 'pessimistic_write' },
      });
      if (!item) throw new NotFoundException('Item not found');
  
      const auctionEnd = new Date(item.createdAt.getTime() + item.duration * 1000);
      if (new Date() > auctionEnd) {
        throw new BadRequestException('Auction has ended');
      }
  
      // Re-check highest bid in transaction
      const highestBid = item.bids.reduce(
        (max, b) => (+b.amount > +max ? +b.amount : +max),
        +item.startingPrice
      );
      if (+amount <= highestBid) {
        throw new BadRequestException('Bid must be higher than current highest bid');
      }
  
      const user = await manager.findOne(this.userRepository.target, {
        where: { id: userId },
      });
      if (!user) throw new NotFoundException('User not found');
  
      const bid = manager.create(this.bidRepository.target, { item, user, amount });
      const saved = await manager.save(bid);
  
      // Optionally: emit updates outside the transaction to avoid blocking
      this.bidGateway.notifyBidUpdate(itemId, amount);
  
      return saved;
    });
  }
  
}
