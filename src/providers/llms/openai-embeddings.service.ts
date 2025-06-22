import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OpenAIEmbeddings } from '@langchain/openai';
import { EmbeddingsService } from './ai-services.interface';
import { EnvKeys, Models, ErrorMessages } from '../../enums/models.enums';

@Injectable()
export class OpenAIEmbeddingsService extends EmbeddingsService {
  private readonly openAIEmbeddings: OpenAIEmbeddings;

  constructor(private readonly configService: ConfigService) {
    super();
    const apiKey = this.configService.get<string>(EnvKeys.OPENAI_API_KEY);
    const model =
      this.configService.get<string>(EnvKeys.DEFAULT_EMBEDDINGS_MODEL) ||
      Models.GPT_TEXT_EMBEDDING_3_SMALL;

    if (!apiKey) {
      throw new Error(
        `${ErrorMessages.API_KEY_NOT_SET}: ${EnvKeys.OPENAI_API_KEY}`,
      );
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
