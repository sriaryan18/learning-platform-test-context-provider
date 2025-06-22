# Configuration Guide

This application is designed to be fully configuration-driven. You can switch between different AI and vector database providers without changing any code.

## Environment Variables

### Vector Database Configuration

The system automatically selects the vector database provider based on the `VECTOR_PROVIDER` environment variable:

```bash
# Use Pinecone (default)
VECTOR_PROVIDER=pinecone
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_HOST=your_pinecone_host
PINECONE_INDEX=your_pinecone_index

# Future providers (examples)
# VECTOR_PROVIDER=weaviate
# WEAVIATE_URL=your_weaviate_url
# WEAVIATE_API_KEY=your_weaviate_api_key

# VECTOR_PROVIDER=chroma
# CHROMA_URL=your_chroma_url
```

### AI Provider Configuration

Configure your AI providers separately for chat and embeddings:

```bash
# Chat LLM Provider (default: openai)
CHAT_PROVIDER=openai
# or
CHAT_PROVIDER=anthropic

# Embeddings Provider (default: openai)
EMBEDDINGS_PROVIDER=openai

# API Keys
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key

# Model Configuration
DEFAULT_CHAT_MODEL=gpt-4o-mini
DEFAULT_EMBEDDINGS_MODEL=text-embedding-3-small

# LLM Parameters
LLM_TEMPERATURE=0.7
LLM_MAX_TOKENS=1000
```

### Kafka Configuration

```bash
KAFKA_BROKERS=localhost:9092
KAFKA_CLIENT_ID=learning-management-test-context-provider
KAFKA_CONSUMER_GROUP_ID=learning-management-group
```

### Application Configuration

```bash
NODE_ENV=development
PORT=3000
```

## Provider Combinations

You can mix and match providers independently:

```bash
# Example 1: OpenAI for chat, OpenAI for embeddings, Pinecone for vectors
CHAT_PROVIDER=openai
EMBEDDINGS_PROVIDER=openai
VECTOR_PROVIDER=pinecone

# Example 2: Anthropic for chat, OpenAI for embeddings, Weaviate for vectors
CHAT_PROVIDER=anthropic
EMBEDDINGS_PROVIDER=openai
VECTOR_PROVIDER=weaviate

# Example 3: All OpenAI with custom models
CHAT_PROVIDER=openai
EMBEDDINGS_PROVIDER=openai
VECTOR_PROVIDER=pinecone
DEFAULT_CHAT_MODEL=gpt-4o
DEFAULT_EMBEDDINGS_MODEL=text-embedding-3-large
```

## Adding New Providers

### Adding a New Vector Database Provider

1. Create a new implementation extending `VectorRepository`:

```typescript
export class WeaviateVectorRepository extends VectorRepository {
  // Implementation
}
```

2. Add the case to the factory in `ProvidersModule`:

```typescript
case 'weaviate':
  return new WeaviateVectorRepository(configService);
```

3. Set the environment variable:

```bash
VECTOR_PROVIDER=weaviate
```

### Adding a New Chat Provider

1. Create a new implementation extending `ChatLLMService`:

```typescript
export class OllamaChatService extends ChatLLMService {
  // Implementation
}
```

2. Add the case to the factory in `ProvidersModule`:

```typescript
case 'ollama':
  return new OllamaChatService(configService);
```

3. Set the environment variable:

```bash
CHAT_PROVIDER=ollama
```

### Adding a New Embeddings Provider

1. Create a new implementation extending `EmbeddingsService`:

```typescript
export class HuggingFaceEmbeddingsService extends EmbeddingsService {
  // Implementation
}
```

2. Add the case to the factory in `ProvidersModule`:

```typescript
case 'huggingface':
  return new HuggingFaceEmbeddingsService(configService);
```

3. Set the environment variable:

```bash
EMBEDDINGS_PROVIDER=huggingface
```

## Benefits

- **Zero Code Changes**: Switch providers by changing environment variables
- **Independent Configuration**: Mix different providers (e.g., Anthropic for chat, OpenAI for embeddings)
- **Type Safety**: Abstract classes provide compile-time type checking
- **Extensibility**: Easy to add new providers without modifying existing code
- **Configuration-Driven**: All provider selection happens at runtime based on environment

The system will automatically use the configured providers without any code changes!
