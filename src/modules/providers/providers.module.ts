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
import {
  AIProviders,
  VectorProviders,
  EnvKeys,
  ErrorMessages,
} from '../../enums/models.enums';
import { GeminiChatService } from './llms/gemini-chat-service';

@Module({
  providers: [
    {
      provide: VectorRepository,
      useFactory: (configService: ConfigService) => {
        const vectorProvider = configService.get<VectorProviders>(
          EnvKeys.VECTOR_PROVIDER,
          VectorProviders.PINECONE,
        );

        switch (vectorProvider) {
          case VectorProviders.PINECONE:
            return new PineconeNotesVectorRepository(configService);
          // Add more vector providers here as needed
          // case VectorProviders.WEAVIATE:
          //   return new WeaviateVectorRepository(configService);
          // case VectorProviders.CHROMA:
          //   return new ChromaVectorRepository(configService);
          default:
            throw new Error(
              `${ErrorMessages.UNSUPPORTED_VECTOR_PROVIDER}: ${vectorProvider}`,
            );
        }
      },
      inject: [ConfigService],
    },
    {
      provide: ChatLLMService,
      useFactory: (configService: ConfigService) => {
        const chatProvider = configService.get<AIProviders>(
          EnvKeys.CHAT_PROVIDER,
          AIProviders.OPENAI,
        );

        switch (chatProvider) {
          case AIProviders.OPENAI:
            return new OpenAIChatService(configService);
          case AIProviders.ANTHROPIC:
            return new AnthropicChatService(configService);
          case AIProviders.GEMINI:
            return new GeminiChatService(configService);
          // Add more chat providers here as needed
          // case AIProviders.OLLAMA:
          //   return new OllamaChatService(configService);
          default:
            throw new Error(
              `${ErrorMessages.UNSUPPORTED_CHAT_PROVIDER}: ${chatProvider}`,
            );
        }
      },
      inject: [ConfigService],
    },
    {
      provide: EmbeddingsService,
      useFactory: (configService: ConfigService) => {
        const embeddingsProvider = configService.get<AIProviders>(
          EnvKeys.EMBEDDINGS_PROVIDER,
          AIProviders.OPENAI,
        );

        switch (embeddingsProvider) {
          case AIProviders.OPENAI:
            return new OpenAIEmbeddingsService(configService);
          // Add more embeddings providers here as needed
          // case AIProviders.HUGGINGFACE:
          //   return new HuggingFaceEmbeddingsService(configService);
          default:
            throw new Error(
              `${ErrorMessages.UNSUPPORTED_EMBEDDINGS_PROVIDER}: ${embeddingsProvider}`,
            );
        }
      },
      inject: [ConfigService],
    },
  ],
  exports: [VectorRepository, ChatLLMService, EmbeddingsService],
})
export class ProvidersModule {}
