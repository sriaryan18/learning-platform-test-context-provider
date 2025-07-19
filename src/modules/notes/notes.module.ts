import { Module } from '@nestjs/common';
import { ProvidersModule } from 'src/modules/providers/providers.module';
import { NotesService } from './notes.service';

@Module({
  providers: [NotesService],
  exports: [NotesService],
  imports: [ProvidersModule],
})
export class NotesModule {}
