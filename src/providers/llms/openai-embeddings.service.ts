import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OpenAIEmbeddings } from '@langchain/openai';
import { EmbeddingsService } from './ai-services.interface';

@Injectable()
export class OpenAIEmbeddingsService extends EmbeddingsService {
  private readonly openAIEmbeddings: OpenAIEmbeddings;

  constructor(private readonly configService: ConfigService) {
    super();
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    const model =
      this.configService.get<string>('DEFAULT_EMBEDDINGS_MODEL') ||
      'text-embedding-3-small';

    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is not set');
    }

    this.openAIEmbeddings = new OpenAIEmbeddings({
      model,
      apiKey,
    });
  }

  getInstance(): OpenAIEmbeddings {
    return this.openAIEmbeddings;
  }
}
