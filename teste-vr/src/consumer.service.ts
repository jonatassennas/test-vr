import { Injectable } from '@nestjs/common';
import * as amqp from 'amqplib';
import { StatusService } from './status.service';
import { MensagemDto } from './interfaces/mensagem.interface';
import { AppGateway } from './app.gateway';

@Injectable()
export class ConsumerService {
  private readonly entradaQueue = 'fila.notificacao.entrada.jonatas';
  private readonly statusQueue = 'fila.notificacao.status.jonatas';

  constructor(
    private readonly statusService: StatusService,
    private readonly appGateway: AppGateway,
  ) {}

  async startConsuming(channel: amqp.Channel) {
    await channel.assertQueue(this.entradaQueue);

    channel.consume(this.entradaQueue, async (msg) => {
      if (!msg) return;

      const mensagem: MensagemDto = JSON.parse(msg.content.toString());

      await new Promise((res) => setTimeout(res, 1000 + Math.random() * 1000));

      const chance: number = Math.floor(Math.random() * 10) + 1;
      const status: string =
        chance <= 2 ? 'FALHA_PROCESSAMENTO' : 'PROCESSADO_SUCESSO';
      this.statusService.setStatus(mensagem.mensagemId, status);

      mensagem.status = status;

      const payload = Buffer.from(JSON.stringify(mensagem));
      channel.sendToQueue(this.statusQueue, payload);

      this.appGateway.updateStatus(mensagem);

      channel.ack(msg);
    });
  }
}
