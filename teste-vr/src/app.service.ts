import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import * as amqp from 'amqplib';
import { RabbitMQService } from './rabbitmq.service';
import { StatusService } from './status.service';

interface NotificarDto {
  conteudoMensagem: string;
}

@Injectable()
export class AppService {
  private readonly entradaQueue = 'fila.notificacao.entrada.jonatas';

  constructor(
    private readonly rabbit: RabbitMQService,
    private readonly statusService: StatusService,
  ) {}

  async notificar(dto: NotificarDto): Promise<{ mensagemId: string }> {
    if (!dto.conteudoMensagem || dto.conteudoMensagem.trim() === '') {
      throw new Error('A mensagem não pode estar vazia');
    }

    const mensagemId = uuidv4();
    const channel: amqp.Channel = this.rabbit.getChannel();

    await channel.assertQueue(this.entradaQueue);
    channel.sendToQueue(
      this.entradaQueue,
      Buffer.from(JSON.stringify({ mensagemId, conteudoMensagem: dto.conteudoMensagem })),
    );

    this.statusService.setStatus(mensagemId, 'PROCESSANDO');

    return { mensagemId };
  }

  getStatus(id: string): string | undefined {
    return this.statusService.getStatus(id);
  }
}
