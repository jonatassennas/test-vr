import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { RabbitMQService } from './rabbitmq.service';
import { ConfigModule } from '@nestjs/config';
import { ConsumerService } from './consumer.service';
import { StatusService } from './status.service';
import { AppService } from './app.service';
import { AppGateway } from './app.gateway';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [
    ConsumerService,
    RabbitMQService,
    StatusService,
    AppService,
    AppGateway,
  ],
})
export class AppModule {}
