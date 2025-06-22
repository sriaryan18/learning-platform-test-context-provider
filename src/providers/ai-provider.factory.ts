import { ChatAnthropic } from '@langchain/anthropic';
import { ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Models, Providers } from 'src/enums/models.enums';

@Injectable()
export class AiProviderFactory {
  constructor(private readonly configService: ConfigService) {}

  getLLM(provider: Providers, model: Models): ChatOpenAI | ChatAnthropic {
    const apiKey = this.configService.get<string>(
      `${provider.toUpperCase()}_API_KEY`,
    );
    if (!apiKey) {
      throw new Error(`${provider.toUpperCase()}_API_KEY is not set`);
    }
    switch (provider) {
      case Providers.OPENAI:
        return this.getChatGPT(model);
      case Providers.ANTHROPIC:
        return this.getAnthropic(model);
      default:
        throw new Error(`Provider ${provider} not supported`);
    }
  }

  getEmbeddingsLLM(provider: Providers, model: Models): OpenAIEmbeddings {
    const apiKey = this.configService.get<string>(
      `${provider.toUpperCase()}_API_KEY`,
    );
    if (!apiKey) {
      throw new Error(`${provider.toUpperCase()}_API_KEY is not set`);
    }

    switch (provider) {
      case Providers.OPENAI:
        return new OpenAIEmbeddings({ model, apiKey });
      default:
        throw new Error(`Provider ${provider} not supported`);
    }
  }

  // TODO: ADD model specific configs
  private getChatGPT(model: Models) {
    return new ChatOpenAI({ model });
  }

  private getAnthropic(model: Models) {
    return new ChatAnthropic({ model });
  }
}
