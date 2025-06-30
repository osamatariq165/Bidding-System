import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Item } from './item.entity';

@Injectable()
export class AuctionService {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
  ) {}

  async createAuction(
    name: string,
    description: string,
    startingPrice: number,
    duration: number,
  ): Promise<Item> {
    const auction = this.itemRepository.create({
      name,
      description,
      startingPrice,
      duration,
      createdAt: new Date(),
    });
    return this.itemRepository.save(auction);
  }

  async findAll(): Promise<Item[]> {
    return this.itemRepository.find({
      relations: ['bids'],
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Item | undefined> {
    return this.itemRepository.findOne({
      where: { id },
      relations: ['bids'],
    });
  }
}
