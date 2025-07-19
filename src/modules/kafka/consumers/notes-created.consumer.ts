import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { KafkaTopics } from '../../../enums/kafka.enums';
import { NotesCreatedDto } from '../../../dtos/notes-created.dto';
import { NotesService } from 'src/modules/notes/notes.service';
import { Builder } from 'builder-pattern';

interface NotesData {
  content: string;
  lectureId: string;
  instructorId: string;
}

@Controller()
export class NotesCreatedConsumer {
  private readonly logger = new Logger(NotesCreatedConsumer.name);

  constructor(private readonly notesService: NotesService) {
    this.logger.log('NotesCreatedConsumer initialized');
  }

  @EventPattern(KafkaTopics.NOTES_CREATED)
  handleNotesCreated(@Payload() data: NotesData) {
    this.logger.log('Received message from Kafka', data);

    this.notesService.handleNotesCreated(data);
  }
}
