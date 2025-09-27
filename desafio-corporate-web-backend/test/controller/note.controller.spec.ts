import { Test, TestingModule } from '@nestjs/testing';
import { NoteController } from '../../src/controller/note.controller';
import { NoteService } from '../../src/service';
import { DI_NOTE_SERVICE } from '../../config';
import { getMapperToken } from '@automapper/nestjs';
import {
	NoteUpsertDTO,
	NoteReadDTO,
	NoteTitleDTO,
} from '../../src/controller/dto';
import { NoteModel } from '../../src/model';
import { Mapper } from '@automapper/core';
import { HttpException, HttpStatus, NotFoundException } from '@nestjs/common';

describe('NoteController', () => {
	let controller: NoteController;
	let noteService: NoteService;
	let mapper: Mapper;

	// Mock para todas as dependências do controller
	const noteServiceMock = {
		createNote: jest.fn(),
		searchTitleList: jest.fn(),
		getNoteContent: jest.fn(),
		updateNote: jest.fn(),
		deleteNote: jest.fn(),
	};

	const mapperMock = {
		map: jest.fn(),
		mapAsync: jest.fn(),
		mapArrayAsync: jest.fn(),
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [NoteController],
			providers: [
				{ provide: DI_NOTE_SERVICE, useValue: noteServiceMock },
				{ provide: getMapperToken(), useValue: mapperMock },
			],
		}).compile();

		controller = module.get<NoteController>(NoteController);
		noteService = module.get<NoteService>(DI_NOTE_SERVICE);
		mapper = module.get<Mapper>(getMapperToken());
	});

	// Limpa o estado dos mocks após cada teste
	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});

	describe('createNote', () => {
		it('should create a note and return the mapped DTO', async () => {
			const noteUpsertDTO: NoteUpsertDTO = {
				title: 'Test Note',
				content: 'Test Content',
			};
			const noteModel = new NoteModel();
			const createdNoteModel = { ...noteModel, id: 1 };
			const expectedReadDTO: NoteReadDTO = {
				title: 'Test Note',
				content: 'Test Content',
			};

			(mapper.map as jest.Mock).mockReturnValue(noteModel);
			(noteService.createNote as jest.Mock).mockResolvedValue(createdNoteModel);
			(mapper.mapAsync as jest.Mock).mockResolvedValue(expectedReadDTO);

			const result = await controller.createNote(noteUpsertDTO);

			expect(mapper.map).toHaveBeenCalledWith(
				noteUpsertDTO,
				NoteUpsertDTO,
				NoteModel,
			);
			expect(noteService.createNote).toHaveBeenCalledWith(noteModel);
			expect(mapper.mapAsync).toHaveBeenCalledWith(
				createdNoteModel,
				NoteModel,
				NoteReadDTO,
			);
			expect(result).toEqual(expectedReadDTO);
		});
	});

	describe('readNoteListByTitle', () => {
		it('should return a list of note DTOs if notes are found', async () => {
			const title = 'Test';
			const noteTitleDTO: NoteTitleDTO = { title };
			const foundNotesModel: NoteModel[] = [
				{ id: 1, title: 'Test Note 1', content: 'Content 1' },
				{ id: 2, title: 'Another Test Note', content: 'Content 2' },
			];
			const expectedTitleDTOs: NoteTitleDTO[] = [
				{ title: 'Test Note 1' },
				{ title: 'Another Test Note' },
			];

			(noteService.searchTitleList as jest.Mock).mockResolvedValue(
				foundNotesModel,
			);
			(mapper.mapArrayAsync as jest.Mock).mockResolvedValue(expectedTitleDTOs);

			const result = await controller.readNoteListByTitle(noteTitleDTO);

			expect(noteService.searchTitleList).toHaveBeenCalledWith(title);
			expect(mapper.mapArrayAsync).toHaveBeenCalledWith(
				foundNotesModel,
				NoteModel,
				NoteTitleDTO,
			);
			expect(result).toEqual(expectedTitleDTOs);
		});

		it('should throw HttpException with NO_CONTENT status if no notes are found', async () => {
			const title = 'Unknown';
			const noteTitleDTO: NoteTitleDTO = { title };
			(noteService.searchTitleList as jest.Mock).mockResolvedValue([]);

			await expect(
				controller.readNoteListByTitle(noteTitleDTO),
			).rejects.toThrow(
				new HttpException(
					'Não existem anotações correspondentes a pesquisa',
					HttpStatus.NO_CONTENT,
				),
			);

			expect(noteService.searchTitleList).toHaveBeenCalledWith(title);
			expect(mapper.mapArrayAsync).not.toHaveBeenCalled();
		});
	});

	describe('readNoteContent', () => {
		it('should return a single note DTO if found', async () => {
			const title = 'Found Note';
			const noteTitleDTO: NoteTitleDTO = { title };
			const foundNoteModel: NoteModel = {
				id: 1,
				title: title,
				content: 'Content',
			};
			const expectedReadDTO: NoteReadDTO = { title: title, content: 'Content' };

			(noteService.getNoteContent as jest.Mock).mockResolvedValue(
				foundNoteModel,
			);
			(mapper.mapAsync as jest.Mock).mockResolvedValue(expectedReadDTO);

			const result = await controller.readNoteContent(noteTitleDTO);

			expect(noteService.getNoteContent).toHaveBeenCalledWith(title);
			expect(mapper.mapAsync).toHaveBeenCalledWith(
				foundNoteModel,
				NoteModel,
				NoteReadDTO,
			);
			expect(result).toEqual(expectedReadDTO);
		});

		it('should throw NotFoundException if the note is not found', async () => {
			const title = 'Not Found Note';
			const noteTitleDTO: NoteTitleDTO = { title };
			const error = new NotFoundException('Error');

			(noteService.getNoteContent as jest.Mock).mockRejectedValue(error);

			await expect(controller.readNoteContent(noteTitleDTO)).rejects.toThrow(
				NotFoundException,
			);
			expect(noteService.getNoteContent).toHaveBeenCalledWith(title);
			expect(mapper.mapAsync).not.toHaveBeenCalled();
		});
	});

	describe('updateNote', () => {
		it('should update a note and return the updated DTO', async () => {
			const oldTitle = 'Old Title';
			const noteUpsertDTO: NoteUpsertDTO = {
				title: 'New Title',
				content: 'Updated Content',
			};
			const noteModelToUpdate = new NoteModel();
			const updatedNoteModel = { ...noteModelToUpdate, id: 1 };
			const expectedReadDTO: NoteReadDTO = {
				title: 'New Title',
				content: 'Updated Content',
			};

			(mapper.map as jest.Mock).mockReturnValue(noteModelToUpdate);
			(noteService.updateNote as jest.Mock).mockResolvedValue(updatedNoteModel);
			(mapper.mapAsync as jest.Mock).mockResolvedValue(expectedReadDTO);

			const result = await controller.updateNote(noteUpsertDTO, oldTitle);

			expect(mapper.map).toHaveBeenCalledWith(
				noteUpsertDTO,
				NoteUpsertDTO,
				NoteModel,
			);
			expect(noteService.updateNote).toHaveBeenCalledWith(
				noteModelToUpdate,
				oldTitle,
			);
			expect(mapper.mapAsync).toHaveBeenCalledWith(
				updatedNoteModel,
				NoteModel,
				NoteReadDTO,
			);
			expect(result).toEqual(expectedReadDTO);
		});
	});

	describe('deleteNote', () => {
		it('should call the delete service method with the correct title', async () => {
			const noteTitleDTO: NoteTitleDTO = { title: 'Note to Delete' };
			(noteService.deleteNote as jest.Mock).mockResolvedValue(undefined);

			await expect(
				controller.deleteNote(noteTitleDTO),
			).resolves.toBeUndefined();

			expect(noteService.deleteNote).toHaveBeenCalledWith(noteTitleDTO.title);
			expect(noteService.deleteNote).toHaveBeenCalledTimes(1);
		});
	});
});
