import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { MensagemDto } from './interfaces/mensagem.interface';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class AppGateway {
  @WebSocketServer()
  server: Server;

  updateStatus(data: MensagemDto) {
    this.server.emit('updateStatus', data);
  }
}
