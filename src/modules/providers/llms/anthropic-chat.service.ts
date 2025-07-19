import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatAnthropic } from '@langchain/anthropic';
import { ChatLLMService } from './ai-services.interface';
import { EnvKeys, ErrorMessages } from '../../../enums/models.enums';

@Injectable()
export class AnthropicChatService extends ChatLLMService {
  private readonly chatAnthropic: ChatAnthropic;

  constructor(private readonly configService: ConfigService) {
    super();
    const apiKey = this.configService.get<string>(EnvKeys.ANTHROPIC_API_KEY);
    const model = this.configService.get<string>(EnvKeys.DEFAULT_CHAT_MODEL);
    if (!apiKey) {
      throw new Error(
        `${ErrorMessages.API_KEY_NOT_SET}: ${EnvKeys.ANTHROPIC_API_KEY}`,
      );
    }

    this.chatAnthropic = new ChatAnthropic({
      model,
      apiKey,
      temperature:
        Number(this.configService.get<number>(EnvKeys.LLM_TEMPERATURE)) || 0.7,
      maxTokens:
        Number(this.configService.get<number>(EnvKeys.LLM_MAX_TOKENS)) || 1000,
    });
  }

  getInstance(): ChatAnthropic {
    return this.chatAnthropic;
  }
}
