import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { KafkaModule } from './kafka/kafka.module';

const configModule = ConfigModule.forRoot({
  isGlobal: true,
  envFilePath: '.env',
});

@Module({
  imports: [configModule, KafkaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
