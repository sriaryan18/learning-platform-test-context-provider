import { Injectable } from '@nestjs/common';
import { VectorRepository } from './vectors.repository.interface';
import { Index, Pinecone, PineconeRecord } from '@pinecone-database/pinecone';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PineconeNotesVectorRepository extends VectorRepository {
  private readonly pinecone: Pinecone;
  private readonly index: Index;
  constructor(private readonly configService: ConfigService) {
    super();
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  get(namespace: string, context: string): Promise<PineconeRecord[]> {
    throw new Error('Method not implemented.');
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  delete(namespace: string, context: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
