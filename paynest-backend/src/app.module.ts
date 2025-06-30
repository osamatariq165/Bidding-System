import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuctionModule } from './auction/auction.module';
import { BidModule } from './bid/bid.module';
import { ConfigModule } from '@nestjs/config';
import { Item } from './auction/item.entity';
import { User } from './user/user.entity';
import { Bid } from './bid/bid.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    // TypeOrmModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
      entities: [Item, User, Bid],
      synchronize: true,
    }),
    AuctionModule,
    BidModule,
  ],
})
export class AppModule {}
