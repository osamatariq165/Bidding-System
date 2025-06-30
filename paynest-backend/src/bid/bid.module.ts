import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BidService } from './bid.service';
import { BidController } from './bid.controller';
import { BidGateway } from './bid.gateway';
import { Bid } from './bid.entity';
import { Item } from '../auction/item.entity';
import { User } from '../user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Bid, Item, User])],
  providers: [BidService, BidGateway],
  controllers: [BidController],
})
export class BidModule {}
