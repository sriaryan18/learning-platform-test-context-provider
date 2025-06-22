import { Inject, Injectable } from '@nestjs/common';
import { VectorRepository } from 'src/providers/vectorDB/vectors.repository.interface';
import { PineconeRecord } from '@pinecone-database/pinecone';

@Injectable()
export class NotesVectorRepository {
  @Inject('PineconeVectorRepository')
  private readonly vectorRepository: VectorRepository;

  private readonly pineconeNotesNamespace: string = '__default__';

  async save(records: PineconeRecord[]): Promise<void> {
    await this.vectorRepository.save(this.pineconeNotesNamespace, records);
  }
}
