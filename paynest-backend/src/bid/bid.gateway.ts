import {
    WebSocketGateway,
    WebSocketServer,
  } from '@nestjs/websockets';
  import { Server } from 'socket.io';
  
  @WebSocketGateway({ cors: { origin: '*' } })
  export class BidGateway {
    @WebSocketServer()
    server: Server;
  
    notifyBidUpdate(itemId: number, amount: number) {
      this.server.emit('bidUpdate', { itemId, amount });
    }
  }
  