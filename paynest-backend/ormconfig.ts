import * as dotenv from 'dotenv';
dotenv.config();
import { DataSource } from 'typeorm';
import { Item } from './src/auction/item.entity';
import { User } from './src/user/user.entity';
import { Bid } from './src/bid/bid.entity';

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  entities: [Item, User, Bid],
  synchronize: true, // keep true for dev/testing
});
