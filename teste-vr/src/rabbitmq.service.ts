import { Injectable, OnModuleInit } from '@nestjs/common';
import * as amqp from 'amqplib';
import { ConsumerService } from './consumer.service';

@Injectable()
export class RabbitMQService implements OnModuleInit {
  private channel: amqp.Channel;

  constructor(private readonly consumerService: ConsumerService) {}

  async onModuleInit() {
    try {
      const connection = await amqp.connect('amqp://guest:guest@localhost:5672');
      this.channel = await connection.createChannel();

      console.log('RabbitMQ conectado, iniciando consumer...');
      await this.consumerService.startConsuming(this.channel);
    } catch (error) {
      console.error('Erro ao conectar no RabbitMQ:', error);
    }
  }

  getChannel(): amqp.Channel {
    if (!this.channel) {
      throw new Error('RabbitMQ não conectado');
    }
    return this.channel;
  }
}
