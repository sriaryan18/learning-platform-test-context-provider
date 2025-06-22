import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatOpenAI } from '@langchain/openai';
import { ChatLLMService } from './ai-services.interface';

@Injectable()
export class OpenAIChatService extends ChatLLMService {
  private readonly chatOpenAI: ChatOpenAI;

  constructor(private readonly configService: ConfigService) {
    super();
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    const model =
      this.configService.get<string>('DEFAULT_CHAT_MODEL') || 'gpt-4o-mini';

    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is not set');
    }

    this.chatOpenAI = new ChatOpenAI({
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

  getInstance(): ChatOpenAI {
    return this.chatOpenAI;
  }
}
