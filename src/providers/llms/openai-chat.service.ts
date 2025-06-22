import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatOpenAI } from '@langchain/openai';
import { ChatLLMService } from './ai-services.interface';
import { EnvKeys, Models, ErrorMessages } from '../../enums/models.enums';

@Injectable()
export class OpenAIChatService extends ChatLLMService {
  private readonly chatOpenAI: ChatOpenAI;

  constructor(private readonly configService: ConfigService) {
    super();
    const apiKey = this.configService.get<string>(EnvKeys.OPENAI_API_KEY);
    const model =
      this.configService.get<string>(EnvKeys.DEFAULT_CHAT_MODEL) ||
      Models.GPT_4O_MINI;

    if (!apiKey) {
      throw new Error(
        `${ErrorMessages.API_KEY_NOT_SET}: ${EnvKeys.OPENAI_API_KEY}`,
      );
    }

    this.chatOpenAI = new ChatOpenAI({
      model,
      apiKey,
      temperature:
        this.configService.get<number>(EnvKeys.LLM_TEMPERATURE) || 0.7,
      maxTokens: this.configService.get<number>(EnvKeys.LLM_MAX_TOKENS) || 1000,
    });
  }

  getInstance(): ChatOpenAI {
    return this.chatOpenAI;
  }
}
