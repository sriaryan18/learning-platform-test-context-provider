import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { ChatLLMService } from './ai-services.interface';
import { EnvKeys, Models, ErrorMessages } from '../../../enums/models.enums';

@Injectable()
export class GeminiChatService extends ChatLLMService {
  private readonly chatOpenAI: ChatGoogleGenerativeAI;

  constructor(private readonly configService: ConfigService) {
    super();
    const apiKey = this.configService.get<string>(EnvKeys.GEMINI_API_KEY);
    const model =
      this.configService.get<string>(EnvKeys.DEFAULT_CHAT_MODEL) ||
      Models.GPT_4O_MINI;

    if (!apiKey) {
      throw new Error(
        `${ErrorMessages.API_KEY_NOT_SET}: ${EnvKeys.GEMINI_API_KEY}`,
      );
    }

    this.chatOpenAI = new ChatGoogleGenerativeAI({
      model,
      apiKey,
      temperature:
        Number(this.configService.get<number>(EnvKeys.LLM_TEMPERATURE)) || 0.7,
    });
  }

  getInstance(): ChatGoogleGenerativeAI {
    return this.chatOpenAI;
  }
}
