import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import * as amqp from 'amqplib';
import { RabbitMQService } from './rabbitmq.service';
import { StatusService } from './status.service';
import { MensagemDto } from './interfaces/mensagem.interface';

@Injectable()
export class AppService {
  private readonly entradaQueue = 'fila.notificacao.entrada.jonatas';

  constructor(
    private readonly rabbit: RabbitMQService,
    private readonly statusService: StatusService,
  ) {}

  async notificar(dto: MensagemDto): Promise<{ mensagemId: string }> {
    if (!dto.conteudoMensagem || dto.conteudoMensagem.trim() === '') {
      throw new Error('A mensagem não pode estar vazia');
    }
    const channel: amqp.Channel = this.rabbit.getChannel();

    await channel.assertQueue(this.entradaQueue);
    channel.sendToQueue(this.entradaQueue, Buffer.from(JSON.stringify(dto)));

    this.statusService.setStatus(dto.mensagemId, 'PROCESSANDO');

    return dto;
  }

  getStatus(id: string): string | undefined {
    return this.statusService.getStatus(id);
  }
}
