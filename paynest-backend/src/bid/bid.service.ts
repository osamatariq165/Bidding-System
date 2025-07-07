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
    try {
      return await this.dataSource.transaction(async manager => {
        // 1- Lock the Item row without joining bids
        const item = await manager.findOne(this.itemRepository.target, {
          where: { id: itemId },
          lock: { mode: 'pessimistic_write' },
        });
        if (!item) throw new NotFoundException('item not found');
  
        const auctionEnd = new Date(item.createdAt.getTime() + item.duration * 1000);
        if (new Date() > auctionEnd) {
          throw new BadRequestException('auction has ended');
        }
  
        // 2- Load the bids separately inside the transaction
        const bids = await manager.find(this.bidRepository.target, {
          where: { item: { id: itemId } },
        });
  
        // 3- Re-check highest bid
        const highestBid = bids.reduce(
          (max, b) => (+b.amount > +max ? +b.amount : +max),
          +item.startingPrice
        );
        if (+amount <= highestBid) {
          throw new BadRequestException('bid must be higher than current highest bid');
        }
  
        // 4- Load the user
        const user = await manager.findOne(this.userRepository.target, {
          where: { id: userId },
        });
        if (!user) throw new NotFoundException('User not found');
  
        // 5- Create and save the bid
        const bid = manager.create(this.bidRepository.target, { item, user, amount });
        const saved = await manager.save(bid);
  
        // 6- Notify clients
        this.bidGateway.notifyBidUpdate(itemId, amount);
  
        return saved;
      });
    } catch (e) {
      console.log('Error while placing bid:', e);
      throw e;
    }
  }
    
}
