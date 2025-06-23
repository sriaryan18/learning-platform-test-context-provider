export enum Models {
  GPT_4O_MINI = 'gpt-4o-mini',
  GPT_4O = 'gpt-4o',
  GPT_O3 = 'o3',
  GPT_O3_MINI = 'o3-mini',
  GPT_TEXT_EMBEDDING_3_SMALL = 'text-embedding-3-small',
}

export enum AIProviders {
  OPENAI = 'openai',
  OLLAMA = 'ollama',
  ANTHROPIC = 'anthropic',
}

export enum VectorProviders {
  PINECONE = 'pinecone',
  WEAVIATE = 'weaviate',
  CHROMA = 'chroma',
}

// Environment variable keys
export enum EnvKeys {
  // Vector DB
  VECTOR_PROVIDER = 'VECTOR_PROVIDER',
  PINECONE_API_KEY = 'PINECONE_API_KEY',
  PINECONE_HOST = 'PINECONE_HOST',
  PINECONE_INDEX = 'PINECONE_INDEX',

  // AI Providers
  CHAT_PROVIDER = 'CHAT_PROVIDER',
  EMBEDDINGS_PROVIDER = 'EMBEDDINGS_PROVIDER',
  OPENAI_API_KEY = 'OPENAI_API_KEY',
  ANTHROPIC_API_KEY = 'ANTHROPIC_API_KEY',

  // Model Configuration
  DEFAULT_CHAT_MODEL = 'DEFAULT_CHAT_MODEL',
  DEFAULT_EMBEDDINGS_MODEL = 'DEFAULT_EMBEDDINGS_MODEL',
  LLM_TEMPERATURE = 'LLM_TEMPERATURE',
  LLM_MAX_TOKENS = 'LLM_MAX_TOKENS',
  EMBEDDINGS_DIMENSIONS = 'EMBEDDINGS_DIMENSIONS',
}

// Error Messages
export enum ErrorMessages {
  UNSUPPORTED_VECTOR_PROVIDER = 'Unsupported vector provider',
  UNSUPPORTED_CHAT_PROVIDER = 'Unsupported chat provider',
  UNSUPPORTED_EMBEDDINGS_PROVIDER = 'Unsupported embeddings provider',
  API_KEY_NOT_SET = 'API key is not set',
}

// Legacy enum for backward compatibility
export enum Providers {
  OPENAI = 'OPENAI',
  OLLAMA = 'OLLAMA',
  ANTHROPIC = 'ANTHROPIC',
}
