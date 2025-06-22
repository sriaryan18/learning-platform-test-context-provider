import { Injectable } from '@nestjs/common';
import { VectorRepository } from './vectors.repository.interface';
import { Index, Pinecone, PineconeRecord } from '@pinecone-database/pinecone';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PineconeNotesVectorRepository implements VectorRepository {
  private readonly pinecone: Pinecone;
  private readonly index: Index;
  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('PINECONE_API_KEY');
    const host = this.configService.get<string>('PINECONE_HOST');
    const index = this.configService.get<string>('PINECONE_INDEX');
    if (!apiKey || !host || !index) {
      throw new Error('PINECONE_API_KEY is not set');
    }
    this.pinecone = new Pinecone({ apiKey });
    this.index = this.pinecone.Index(index);
  }
  async save(namespace: string, records: PineconeRecord[]): Promise<void> {
    await this.index.namespace(namespace).upsert(records);
  }
  get(namespace: string, context: string): Promise<PineconeRecord[]> {
    throw new Error('Method not implemented.');
  }
  delete(namespace: string, context: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
