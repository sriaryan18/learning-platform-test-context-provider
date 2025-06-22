import { PineconeRecord } from '@pinecone-database/pinecone';

export abstract class VectorRepository {
  abstract save(namespace: string, records: PineconeRecord[]): Promise<void>;
  abstract get(namespace: string, context: string): Promise<PineconeRecord[]>;
  abstract delete(namespace: string, context: string): Promise<void>;
}
