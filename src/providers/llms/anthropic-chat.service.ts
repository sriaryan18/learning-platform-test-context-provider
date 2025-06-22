import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatAnthropic } from '@langchain/anthropic';
import { ChatLLMService } from './ai-services.interface';

@Injectable()
export class AnthropicChatService extends ChatLLMService {
  private readonly chatAnthropic: ChatAnthropic;

  constructor(private readonly configService: ConfigService) {
    super();
    const apiKey = this.configService.get<string>('ANTHROPIC_API_KEY');
    const model =
      this.configService.get<string>('DEFAULT_CHAT_MODEL') ||
      'claude-3-haiku-20240307';

    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY is not set');
    }

    this.chatAnthropic = new ChatAnthropic({
      model,
      apiKey,
      temperature: Number(
        this.configService.get<number>('LLM_TEMPERATURE') || 0.7,
      ),
      maxTokens: Number(
        this.configService.get<number>('LLM_MAX_TOKENS') || 1000,
      ),
    });
  }

  getInstance(): ChatAnthropic {
    return this.chatAnthropic;
  }
}
