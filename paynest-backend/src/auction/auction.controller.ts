import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { AuctionService } from './auction.service';

@Controller('auction')
export class AuctionController {
  constructor(private readonly auctionService: AuctionService) {}

  @Post()
  create(@Body() body: { name: string; description: string; startingPrice: number; duration: number }) {
    return this.auctionService.createAuction(
      body.name,
      body.description,
      body.startingPrice,
      body.duration,
    );
  }

  @Get()
  findAll() {
    return this.auctionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.auctionService.findOne(parseInt(id));
  }
}
