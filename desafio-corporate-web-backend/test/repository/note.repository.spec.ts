import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../src/infrastructure';
import { NoteRepository } from '../../src/repository';
import { NoteModel } from '../../src/model';

// O mock do PrismaService continua o mesmo
const prismaServiceMock = {
	note: {
		findMany: jest.fn(),
		upsert: jest.fn(),
		delete: jest.fn(),
		findUnique: jest.fn(),
		update: jest.fn(),
	},
};

describe('NoteRepository', () => {
	let repository: NoteRepository;
	let prismaService: PrismaService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				NoteRepository,
				{
					provide: PrismaService,
					useValue: prismaServiceMock,
				},
			],
		}).compile();

		repository = module.get<NoteRepository>(NoteRepository);
		prismaService = module.get<PrismaService>(PrismaService);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should be defined', () => {
		expect(repository).toBeDefined();
	});

	describe('findNotesByTitle', () => {
		it('should return a list of notes matching the title', async () => {
			const mockNotes: NoteModel[] = [
				{ id: 1, title: 'Test', content: 'Content' },
			];
			// CORREÇÃO APLICADA AQUI
			(prismaService.note.findMany as jest.Mock).mockResolvedValue(mockNotes);

			const result = await repository.findNotesByTitle('Test');

			// E AQUI
			expect(prismaService.note.findMany).toHaveBeenCalledWith({
				where: {
					title: {
						contains: 'Test',
						mode: 'insensitive',
					},
				},
			});
			expect(result).toEqual(mockNotes);
		});
	});

	describe('upsertNote', () => {
		it('should upsert a note and return the created/updated note', async () => {
			const newNote: NoteModel = {
				id: 1,
				title: 'New Note',
				content: 'Content',
			};
			// CORREÇÃO APLICADA AQUI
			(prismaService.note.upsert as jest.Mock).mockResolvedValue(newNote);

			const result = await repository.upsertNote(newNote);

			// E AQUI
			expect(prismaService.note.upsert).toHaveBeenCalledWith({
				where: { title: newNote.title },
				update: { content: newNote.content },
				create: { title: newNote.title!, content: newNote.content! },
			});
			expect(result).toEqual(newNote);
		});
	});

	describe('removeNote', () => {
		it('should delete a note by title', async () => {
			// CORREÇÃO APLICADA AQUI
			(prismaService.note.delete as jest.Mock).mockResolvedValue(undefined);

			await repository.removeNote('Test');

			// E AQUI
			expect(prismaService.note.delete).toHaveBeenCalledWith({
				where: { title: 'Test' },
			});
		});
	});

	describe('findUniqueNoteByTitle', () => {
		it('should return a unique note by title', async () => {
			const mockNote: NoteModel = {
				id: 1,
				title: 'Unique Note',
				content: 'Content',
			};
			// CORREÇÃO APLICADA AQUI
			(prismaService.note.findUnique as jest.Mock).mockResolvedValue(mockNote);

			const result = await repository.findUniqueNoteByTitle('Unique Note');

			// E AQUI
			expect(prismaService.note.findUnique).toHaveBeenCalledWith({
				where: { title: 'Unique Note' },
			});
			expect(result).toEqual(mockNote);
		});
	});

	describe('findUniqueNoteById', () => {
		it('should return a unique note by id', async () => {
			const mockNote: NoteModel = {
				id: 1,
				title: 'Note By Id',
				content: 'Content',
			};
			// CORREÇÃO APLICADA AQUI
			(prismaService.note.findUnique as jest.Mock).mockResolvedValue(mockNote);

			const result = await repository.findUniqueNoteById({
				id: 1,
			} as NoteModel);

			// E AQUI
			expect(prismaService.note.findUnique).toHaveBeenCalledWith({
				where: { id: 1 },
			});
			expect(result).toEqual(mockNote);
		});
	});

	describe('saveNote', () => {
		it('should update and return the saved note', async () => {
			const mockNote: NoteModel = {
				id: 1,
				title: 'Updated Note',
				content: 'New Content',
			};
			// CORREÇÃO APLICADA AQUI
			(prismaService.note.update as jest.Mock).mockResolvedValue(mockNote);

			const result = await repository.saveNote(mockNote);

			// E AQUI
			expect(prismaService.note.update).toHaveBeenCalledWith({
				where: { id: mockNote.id },
				data: mockNote,
			});
			expect(result).toEqual(mockNote);
		});
	});
});
