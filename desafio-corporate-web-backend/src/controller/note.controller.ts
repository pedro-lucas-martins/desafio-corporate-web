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
import { NoteModel } from '../model';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { UnexpectedResponses } from '../../decorator';
import {
	ApiConflictResponse,
	ApiCreatedResponse,
	ApiNoContentResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
} from '@nestjs/swagger';
import { DI_NOTE_SERVICE } from '../../config';
import { NoteService } from '../service';

@Controller('note')
export class NoteController {
	public constructor(
		@InjectMapper() private readonly mapper: Mapper,
		@Inject(DI_NOTE_SERVICE) private noteService: NoteService,
	) {}

	@ApiConflictResponse({
		description:
			'Não pode ser inserido, ja existe uma anotação com esse título',
	})
	@ApiCreatedResponse({
		type: NoteReadDTO,
		description: 'Anotação criada com sucesso',
	})
	@UnexpectedResponses()
	@ApiOperation({ description: 'Cria uma anotação nova e insere no sistema' })
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

	@ApiNoContentResponse({
		description:
			'Não existem anotções com esse titulo, retorna uma lista vazia',
	})
	@ApiOkResponse({ description: 'Anotações encontradas' })
	@UnexpectedResponses()
	@ApiOperation({
		description: 'Retorna uma lista com as notas que contem o titulo informado',
	})
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

	@ApiNotFoundResponse({
		type: NoteReadDTO,
		description: 'Título não encontrado',
	})
	@ApiOkResponse({ description: 'Anotação encontrada' })
	@UnexpectedResponses()
	@ApiOperation({ description: 'Busca uma anotação no sistema' })
	@Get('/content/:title')
	public async readNoteContent(
		@Param() noteTitleDTO: NoteTitleDTO,
	): Promise<NoteReadDTO> {
		const note: NoteModel = await this.noteService.getNoteContent(
			noteTitleDTO.title,
		);
		return this.mapper.mapAsync(note, NoteModel, NoteReadDTO);
	}

	@ApiNotFoundResponse({
		type: NoteReadDTO,
		description: 'Não existe anotação com esse nome',
	})
	@ApiOkResponse({
		type: NoteReadDTO,
		description: 'Anotação atualizada com sucesso',
	})
	@UnexpectedResponses()
	@ApiOperation({ description: 'Atualiza uma anotação existente no sistema' })
	@Put(':title')
	public async updateNote(
		@Body() noteUpsertDTO: NoteUpsertDTO,
		@Param('title') title: string, // Titulo antigo
	): Promise<NoteReadDTO> {
		const note: NoteModel = this.mapper.map(
			noteUpsertDTO,
			NoteUpsertDTO,
			NoteModel,
		);
		const updatedNote: NoteModel = await this.noteService.updateNote(
			note,
			title,
		); // manda nota nova

		return this.mapper.mapAsync(updatedNote, NoteModel, NoteReadDTO);
	}

	@ApiNotFoundResponse({
		type: NoteReadDTO,
		description: 'Não existe anotação com esse nome',
	})
	@ApiOkResponse({ description: 'Anotação deletada com sucesso' })
	@ApiOperation({ description: 'Deleta uma anotação no sistema' })
	@UnexpectedResponses()
	@Delete(':title')
	public async deleteNote(@Param() noteTitleDTO: NoteTitleDTO): Promise<void> {
		await this.noteService.deleteNote(noteTitleDTO.title);
	}
}
