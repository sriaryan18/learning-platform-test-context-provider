import { KafkaOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { KafkaConfig } from './enums/kafka.enums';

export function kafkaConfig(): KafkaOptions {
  const configService = new ConfigService();
  return {
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: configService.get<string>(KafkaConfig.KAFKA_CLIENT_ID),
        brokers: [
          configService.get<string>(KafkaConfig.KAFKA_BROKER) as string,
        ],
      },
      consumer: {
        groupId: configService.get<string>(
          KafkaConfig.KAFKA_CONSUMER_GROUP_ID,
        ) as string,
      },
      subscribe: {
        fromBeginning: true,
      },
      run: {
        partitionsConsumedConcurrently: 1,
      },
    },
  };
}
