import { Module } from '@nestjs/common';
import { AiProviderModule } from 'src/providers/providers.module';
import { NotesService } from './notes.service';

@Module({
  providers: [NotesService],
  exports: [NotesService],
  imports: [AiProviderModule],
})
export class NotesModule {}
