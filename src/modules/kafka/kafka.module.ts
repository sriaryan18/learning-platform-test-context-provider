import { Module } from '@nestjs/common';
import { NotesCreatedConsumer } from './consumers/notes-created.consumer';
import { NotesModule } from 'src/modules/notes/notes.module';
import { NotesCreatedDto } from 'src/dtos/notes-created.dto';

@Module({
  imports: [NotesModule, NotesCreatedDto],
  controllers: [NotesCreatedConsumer],
  providers: [],
})
export class KafkaModule {}
