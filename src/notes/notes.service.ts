import { Injectable } from '@nestjs/common';
import { NotesCreatedDto } from 'src/dtos/notes-created.dto';

@Injectable()
export class NotesService {
  constructor() {}

  handleNotesCreated(note: NotesCreatedDto) {
    console.log('--- NotesService: handleNotesCreated ---');
    console.log(note);
    console.log('------------------------------------');
  }
}
