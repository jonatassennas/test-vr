import { Injectable } from '@nestjs/common';
import * as amqp from 'amqplib';
import { StatusService } from './status.service';
import { MensagemDto } from './interfaces/mensagem.interface';

@Injectable()
export class ConsumerService {
  private readonly entradaQueue = 'fila.notificacao.entrada.jonatas';
  private readonly statusQueue = 'fila.notificacao.status.jonatas';

  constructor(private readonly statusService: StatusService) {}

  async startConsuming(channel: amqp.Channel) {
    await channel.assertQueue(this.entradaQueue);

    channel.consume(this.entradaQueue, async (msg) => {
      if (!msg) return;

      const mensagem: MensagemDto = JSON.parse(msg.content.toString());
      const { mensagemId, conteudoMensagem } = mensagem;

      console.log(`Recebida: ${mensagemId} - ${conteudoMensagem}`);

      await new Promise((res) => setTimeout(res, 1000 + Math.random() * 1000));

      const chance: number = Math.floor(Math.random() * 10) + 1;
      const status: string =
        chance <= 2 ? 'FALHA_PROCESSAMENTO' : 'PROCESSADO_SUCESSO';
      this.statusService.setStatus(mensagemId, status);

      const payload = Buffer.from(JSON.stringify({ mensagemId, status }));
      channel.sendToQueue(this.statusQueue, payload);
      channel.ack(msg);
    });
  }
}
