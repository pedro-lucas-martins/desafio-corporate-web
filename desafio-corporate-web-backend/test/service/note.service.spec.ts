import { NoteService } from '../../src/service/note.service';
import { NoteRepository } from '../../src/repository';
import { NoteModel } from '../../src/model';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('NoteService', () => {
	let noteService: NoteService;
	let noteRepository: jest.Mocked<NoteRepository>;

	beforeEach(() => {
		noteRepository = {
			findUniqueNoteByTitle: jest.fn(),
			removeNote: jest.fn(),
			upsertNote: jest.fn(),
			findNotesByTitle: jest.fn(),
			saveNote: jest.fn(),
		} as any;
		noteService = new NoteService(noteRepository);
	});

	describe('createNote', () => {
		it('should create a note when title does not exist', async () => {
			const note: NoteModel = {
				title: 'Test',
				content: 'Content',
				id: 0,
			};

			noteRepository.findUniqueNoteByTitle.mockResolvedValue(
				null as unknown as NoteModel,
			);
			noteRepository.upsertNote.mockResolvedValue(note);

			const result = await noteService.createNote(note);

			expect(result).toEqual(note);
			expect(noteRepository.upsertNote).toHaveBeenCalledWith(note);
		});

		it('should throw ConflictException if title exists', async () => {
			const note: NoteModel = {
				title: 'Test',
				content: 'Content',
				id: 0,
			};
			noteRepository.findUniqueNoteByTitle.mockResolvedValue(note);

			await expect(noteService.createNote(note)).rejects.toThrow(
				ConflictException,
			);
		});
	});

	describe('getNoteContent', () => {
		it('should return note if found', async () => {
			const note: NoteModel = {
				title: 'Test',
				content: 'Content',
				id: 0,
			};
			noteRepository.findUniqueNoteByTitle.mockResolvedValue(note);

			const result = await noteService.getNoteContent('Test');
			expect(result).toEqual(note);
		});

		it('should throw NotFoundException if note not found', async () => {
			noteRepository.findUniqueNoteByTitle.mockResolvedValue(
				null as unknown as NoteModel,
			);

			await expect(noteService.getNoteContent('Test')).rejects.toThrow(
				NotFoundException,
			);
		});
	});

	describe('updateNote', () => {
		it('should update note if exists', async () => {
			const existingNote: NoteModel = {
				title: 'Old',
				content: 'Old content',
				id: 0,
			};
			const update: NoteModel = {
				title: 'New',
				content: 'New content',
				id: 0,
			};
			const updatedNote: NoteModel = {
				title: 'New',
				content: 'New content',
				id: 0,
			};

			noteRepository.findUniqueNoteByTitle.mockResolvedValue(existingNote);
			noteRepository.saveNote.mockResolvedValue(updatedNote);

			const result = await noteService.updateNote(update, 'Old');
			expect(result).toEqual(updatedNote);
			expect(noteRepository.saveNote).toHaveBeenCalledWith({
				title: 'New',
				content: 'New content',
				id: 0,
			});
		});

		it('should throw NotFoundException if note does not exist', async () => {
			noteRepository.findUniqueNoteByTitle.mockResolvedValue(
				null as unknown as NoteModel,
			);
			const update: NoteModel = {
				title: 'New',
				content: 'New content',
				id: 0,
			};

			await expect(noteService.updateNote(update, 'Old')).rejects.toThrow(
				NotFoundException,
			);
		});
	});

	describe('deleteNote', () => {
		it('should delete note if exists', async () => {
			const note: NoteModel = {
				title: 'Test',
				content: 'Content',
				id: 0,
			};
			noteRepository.findUniqueNoteByTitle.mockResolvedValue(note);
			noteRepository.removeNote.mockResolvedValue();

			await noteService.deleteNote('Test');
			expect(noteRepository.removeNote).toHaveBeenCalledWith('Test');
		});

		it('should throw NotFoundException if note does not exist', async () => {
			noteRepository.findUniqueNoteByTitle.mockResolvedValue(
				null as unknown as NoteModel,
			);

			await expect(noteService.deleteNote('Test')).rejects.toThrow(
				NotFoundException,
			);
		});
	});

	describe('searchTitleList', () => {
		it('should return notes matching title', async () => {
			const notes: NoteModel[] = [
				{ title: 'Test', content: 'A', id: 1 },
				{ title: 'Test', content: 'B', id: 2 },
			];
			noteRepository.findNotesByTitle.mockResolvedValue(notes);

			const result = await noteService.searchTitleList('Test');
			expect(result).toEqual(notes);
		});

		it('should return empty array if no notes found', async () => {
			noteRepository.findNotesByTitle.mockResolvedValue([]);

			const result = await noteService.searchTitleList('Unknown');
			expect(result).toEqual([]);
		});
	});
});
