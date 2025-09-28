import {
	ConflictException,
	Inject,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { NoteModel } from '../model';
import { DI_NOTE_REPOSITORY } from '../../config';
import { NoteRepository } from '../repository';

@Injectable()
export class NoteService {
	public constructor(
		@Inject(DI_NOTE_REPOSITORY) private noteRepository: NoteRepository,
	) {}
	public async deleteNote(title: string): Promise<void> {
		const searchResult: NoteModel =
			await this.noteRepository.findUniqueNoteByTitle(title);
		if (searchResult === null) {
			throw new NotFoundException(
				'Não foi possível deletar, anotação não existe',
			);
		}
		await this.noteRepository.removeNote(title);
	}

	public async createNote(note: NoteModel): Promise<NoteModel> {
		const searchResult = await this.noteRepository.findUniqueNoteByTitle(
			note.title,
		);
		if (searchResult !== null) {
			throw new ConflictException(
				'O título já existe, não foi possível criar anotação',
			);
		}

		const createdNote: NoteModel = await this.noteRepository.upsertNote(note);

		return createdNote;
	}

	public async searchTitleList(title: string): Promise<NoteModel[]> {
		const searchResults: NoteModel[] =
			await this.noteRepository.findNotesByTitle(title);

		return searchResults;
	}

	public async getNoteContent(title: string): Promise<NoteModel> {
		const searchResult: NoteModel =
			await this.noteRepository.findUniqueNoteByTitle(title);
		if (searchResult === null) {
			throw new NotFoundException('Não existe anotação com o título informado');
		}
		return searchResult;
	}

	public async updateNote(note: NoteModel, title: string): Promise<NoteModel> {
		const searchResult: NoteModel =
			await this.noteRepository.findUniqueNoteByTitle(title);

		if (searchResult === null) {
			throw new NotFoundException(
				'Não foi possível atualizar, não existe anotação com o título informado',
			);
		}

		searchResult.title = note.title;
		searchResult.content = note.content;

		const updatedNote: NoteModel = await this.noteRepository.saveNote(
			searchResult,
		);

		return updatedNote;
	}
}
