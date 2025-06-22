import { PineconeRecord } from '@pinecone-database/pinecone';

export interface VectorRepository {
  save(namespace: string, records: PineconeRecord[]): Promise<void>;
  get(namespace: string, context: string): Promise<PineconeRecord[]>;
  delete(namespace: string, context: string): Promise<void>;
}
