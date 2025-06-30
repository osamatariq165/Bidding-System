import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
  ) {}

  async placeBid(itemId: number, userId: number, amount: number): Promise<Bid> {
    const item = await this.itemRepository.findOne({
      where: { id: itemId },
      relations: ['bids'],
    });
    if (!item) throw new NotFoundException('Item not found');

    const auctionEnd = new Date(item.createdAt.getTime() + item.duration * 1000);
    if (new Date() > auctionEnd) {
      throw new BadRequestException('Auction has ended');
    }

    const highestBid = item.bids.reduce((max, b) => (+b.amount > +max ? +b.amount : +max), +item.startingPrice);
    if (+amount <= highestBid) {
      throw new BadRequestException('Bid must be higher than current highest bid');
    }

    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) throw new NotFoundException('User not found');

    const bid = this.bidRepository.create({ item, user, amount });
    const saved = await this.bidRepository.save(bid);

    // Emit update to clients
    this.bidGateway.notifyBidUpdate(itemId, amount);

    return saved;
  }
}
