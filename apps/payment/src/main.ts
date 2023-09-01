import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger as PinoLogger } from 'nestjs-pino';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.RMQ,
    bufferLogs: true,
    options: {
      urls: ['amqp://localhost:5672'],
      queue: 'payment_queue',
      queueOptions: {
        durable: false,
      },
      noAck: false,
    },
  });

  app.useLogger(app.get(PinoLogger));
  await app.listen();
}
bootstrap();
