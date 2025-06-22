import { Module } from '@nestjs/common';
import { AiProviderFactory } from './ai-provider.factory';
import { PineconeNotesVectorRepository } from './repository.pinecone.impl';

@Module({
  providers: [
    AiProviderFactory,
    {
      provide: 'PineconeVectorRepository',
      useClass: PineconeNotesVectorRepository,
    },
  ],
  exports: [AiProviderFactory, 'PineconeVectorRepository'],
})
export class AiProviderModule {}
