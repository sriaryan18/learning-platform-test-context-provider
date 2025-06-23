import { ChatAnthropic } from '@langchain/anthropic';
import { ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai';

// Abstract class for Chat LLM services
export abstract class ChatLLMService {
  abstract getInstance(): ChatOpenAI | ChatAnthropic;
}

// Abstract class for Embeddings services
export abstract class EmbeddingsService {
  abstract getInstance(): OpenAIEmbeddings;
}
