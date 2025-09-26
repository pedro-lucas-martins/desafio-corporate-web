import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { NoteCreateDTO } from './dto/request';
import { DI_DICTIONARY_SERVICE, DI_NOTE_SERVICE } from 'config';
import { DictionaryService, NoteService } from 'src/service';
import { NoteIdDTO } from './dto/request/note-id.dto';

@Controller('note')
export class NoteController {
  public constructor(
    @Inject(DI_NOTE_SERVICE) private noteService: NoteService,
    @Inject(DI_DICTIONARY_SERVICE) private dictionaryService: DictionaryService,
  ) {}

  @HttpCode(HttpStatus.CREATED)
  @Get(':name/:surname')
  public getHello(
    @Param('name') name: string,
    @Param('surname') surname: string,
  ): string {
    return `Hello ${name} ${surname}`;
  }

  @Get('idade')
  public getPessoa(
    @Query('idade') idade: number,
    @Query('nome') nome: string,
  ): string {
    return `Vc, ${nome} tem ${idade} anos`;
  }

  @Post('exemplo-body')
  public exemploBody(@Body() body: NoteCreateDTO): string {
    return `O corpo da requisição é: ${JSON.stringify(body)}`;
  }

  @Delete(':id')
  public deleteNote(@Param() noteIdDTO: NoteIdDTO): void {
    this.noteService.deleteNote(noteIdDTO.id);
  }
}
