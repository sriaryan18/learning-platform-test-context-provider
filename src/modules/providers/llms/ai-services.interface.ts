import { ChatAnthropic } from '@langchain/anthropic';
import { ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';

// Abstract class for Chat LLM services
export abstract class ChatLLMService {
  abstract getInstance(): ChatOpenAI | ChatAnthropic | ChatGoogleGenerativeAI;
}

// Abstract class for Embeddings services
export abstract class EmbeddingsService {
  abstract getInstance(): OpenAIEmbeddings;
}
