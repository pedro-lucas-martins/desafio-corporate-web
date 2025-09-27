import {
	Body,
	Controller,
	Delete,
	Get,
	HttpException,
	HttpStatus,
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
	public async createNote(
		@Body() noteUpsertDTO: NoteUpsertDTO,
	): Promise<NoteReadDTO> {
		const note: NoteModel = this.mapper.map(
			noteUpsertDTO,
			NoteUpsertDTO,
			NoteModel,
		);
		const createdNote: NoteModel = await this.noteService.createNote(note);
		return this.mapper.mapAsync(createdNote, NoteModel, NoteReadDTO);
	}

	@Get()
	public async readNoteListByTitle(
		@Query() noteTitleDTO: NoteTitleDTO,
	): Promise<NoteTitleDTO[]> {
		const notes: NoteModel[] = await this.noteService.searchTitleList(
			noteTitleDTO.title,
		);

		if (notes.length === 0) {
			throw new HttpException(
				'Não existem anotações correspondentes a pesquisa',
				HttpStatus.NO_CONTENT,
			);
		}
		return this.mapper.mapArrayAsync(notes, NoteModel, NoteTitleDTO);
	}

	@Get('/content/:title')
	public async readNoteContent(
		@Param() noteTitleDTO: NoteTitleDTO,
	): Promise<NoteReadDTO> {
		const note: NoteModel = await this.noteService.getNoteContent(
			noteTitleDTO.title,
		);
		return this.mapper.mapAsync(note, NoteModel, NoteReadDTO);
	}

	@Put()
	public async updateNote(
		@Body() noteUpsertDTO: NoteUpsertDTO,
		//@Param() noteTitleDTO: NoteTitleDTO,
	): Promise<NoteReadDTO> {
		const note: NoteModel = this.mapper.map(
			noteUpsertDTO,
			NoteUpsertDTO,
			NoteModel,
		);
		// TO DO
		// const title: NoteModel = this.mapper.map(
		// 	noteTitleDTO,
		// 	NoteTitleDTO,
		// 	NoteModel,
		// );
		const updatedNote: NoteModel = await this.noteService.updateNote(note);

		return this.mapper.mapAsync(updatedNote, NoteModel, NoteReadDTO);
	}

	@Delete(':title')
	public async deleteNote(@Param() noteTitleDTO: NoteTitleDTO): Promise<void> {
		await this.noteService.deleteNote(noteTitleDTO.title);
	}
}
