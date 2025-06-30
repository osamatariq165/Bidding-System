import { Controller, Post, Body } from '@nestjs/common';
import { BidService } from './bid.service';
import { PlaceBidDto } from './bid.dto';

@Controller('bid')
export class BidController {
  constructor(private readonly bidService: BidService) {}

  @Post()
  placeBid(@Body() dto: PlaceBidDto) {
    return this.bidService.placeBid(dto.itemId, dto.userId, dto.amount);
  }
}
