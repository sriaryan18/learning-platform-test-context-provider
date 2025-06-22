import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { VectorRepository } from './vectorDB/vectors.repository.interface';
import { PineconeNotesVectorRepository } from './vectorDB/repository.pinecone.impl';
import {
  ChatLLMService,
  EmbeddingsService,
} from './llms/ai-services.interface';
import { OpenAIChatService } from './llms/openai-chat.service';
import { AnthropicChatService } from './llms/anthropic-chat.service';
import { OpenAIEmbeddingsService } from './llms/openai-embeddings.service';

@Module({
  providers: [
    {
      provide: VectorRepository,
      useFactory: (configService: ConfigService) => {
        const vectorProvider = configService.get<string>(
          'VECTOR_PROVIDER',
          'pinecone',
        );

        switch (vectorProvider.toLowerCase()) {
          case 'pinecone':
            return new PineconeNotesVectorRepository(configService);
          // Add more vector providers here as needed
          // case 'weaviate':
          //   return new WeaviateVectorRepository(configService);
          // case 'chroma':
          //   return new ChromaVectorRepository(configService);
          default:
            throw new Error(`Unsupported vector provider: ${vectorProvider}`);
        }
      },
      inject: [ConfigService],
    },
    {
      provide: ChatLLMService,
      useFactory: (configService: ConfigService) => {
        const chatProvider = configService.get<string>(
          'CHAT_PROVIDER',
          'openai',
        );

        switch (chatProvider.toLowerCase()) {
          case 'openai':
            return new OpenAIChatService(configService);
          case 'anthropic':
            return new AnthropicChatService(configService);
          // Add more chat providers here as needed
          // case 'ollama':
          //   return new OllamaChatService(configService);
          default:
            throw new Error(`Unsupported chat provider: ${chatProvider}`);
        }
      },
      inject: [ConfigService],
    },
    {
      provide: EmbeddingsService,
      useFactory: (configService: ConfigService) => {
        const embeddingsProvider = configService.get<string>(
          'EMBEDDINGS_PROVIDER',
          'openai',
        );

        switch (embeddingsProvider.toLowerCase()) {
          case 'openai':
            return new OpenAIEmbeddingsService(configService);
          // Add more embeddings providers here as needed
          // case 'huggingface':
          //   return new HuggingFaceEmbeddingsService(configService);
          default:
            throw new Error(
              `Unsupported embeddings provider: ${embeddingsProvider}`,
            );
        }
      },
      inject: [ConfigService],
    },
  ],
  exports: [VectorRepository, ChatLLMService, EmbeddingsService],
})
export class ProvidersModule {}
