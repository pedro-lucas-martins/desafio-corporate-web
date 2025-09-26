import {
	Body,
	Controller,
	Delete,
	Get,
	Inject,
	Param,
	Post,
	Put,
	Query,
} from '@nestjs/common';
import { NoteUpsertDTO, NoteTitleDTO, NoteReadDTO } from './dto';
import { DI_NOTE_SERVICE } from 'config';
import { NoteService } from 'src/service';
import { NoteModel } from '../model';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';

@Controller('note')
export class NoteController {
	public constructor(
		@InjectMapper() private readonly mapper: Mapper,
		@Inject(DI_NOTE_SERVICE) private noteService: NoteService,
	) {}

	@Post()
	public createNote(@Body() noteUpsertDTO: NoteUpsertDTO): NoteReadDTO {
		const note: NoteModel = this.mapper.map(
			noteUpsertDTO,
			NoteUpsertDTO,
			NoteModel,
		);
		const createdNote: NoteModel = this.noteService.createNote(note);
		return this.mapper.map(createdNote, NoteModel, NoteReadDTO);
	}

	@Get()
	public readNoteListByTitle(
		@Query() noteTitleDTO: NoteTitleDTO,
	): NoteTitleDTO[] {
		const notes: NoteModel[] = this.noteService.searchTitleList(
			noteTitleDTO.title,
		);
		return this.mapper.mapArray(notes, NoteModel, NoteTitleDTO);
	}

	@Get('/content/:title')
	public readNoteContent(@Param() noteTitleDTO: NoteTitleDTO): NoteReadDTO {
		const note: NoteModel = this.noteService.getNoteContent(noteTitleDTO.title);
		return this.mapper.map(note, NoteModel, NoteReadDTO);
	}

	@Put()
	public updateNote(@Body() noteUpsertDTO: NoteUpsertDTO): NoteReadDTO {
		const note: NoteModel = this.mapper.map(
			noteUpsertDTO,
			NoteUpsertDTO,
			NoteModel,
		);
		const updatedNote: NoteModel = this.noteService.updateNote(note);

		return this.mapper.map(updatedNote, NoteModel, NoteReadDTO);
	}

	@Delete(':title')
	public deleteNote(@Param() noteTitleDTO: NoteTitleDTO): void {
		this.noteService.deleteNote(noteTitleDTO.title);
	}
}
