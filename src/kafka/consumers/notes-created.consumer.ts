import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { KafkaTopics } from '../../enums/kafka.enums';
import { NotesCreatedDto } from '../../dtos/notes-created.dto';
import { NotesService } from 'src/notes/notes.service';
import { Builder } from 'builder-pattern';

@Controller()
export class NotesCreatedConsumer {
  private readonly logger = new Logger(NotesCreatedConsumer.name);

  constructor(private readonly notesService: NotesService) {
    this.logger.log('NotesCreatedConsumer initialized');
  }

  @EventPattern(KafkaTopics.NOTES_CREATED)
  handleNotesCreated(@Payload() data: string) {
    this.logger.log('Received message from Kafka', data);
    const notesCreatedDto = Builder(NotesCreatedDto).content(data).build();
    this.notesService.handleNotesCreated(notesCreatedDto);
  }
}
