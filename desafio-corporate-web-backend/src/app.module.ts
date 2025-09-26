import { Module } from '@nestjs/common';
import { DI_DICTIONARY_SERVICE, DI_NOTE_SERVICE } from 'config';
import { DictionaryService, NoteService } from './service';
import { NoteController } from './controller';

@Module({
  imports: [],
  controllers: [NoteController],
  providers: [
    { provide: DI_NOTE_SERVICE, useClass: NoteService },
    { provide: DI_DICTIONARY_SERVICE, useClass: DictionaryService },
  ],
})
export class AppModule {}
