import { Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "../infrastructure";
import { DI_PRISMA_SERVICE } from "../../config";
import { NoteModel } from "../model";
import { Note } from "@prisma/client";

@Injectable()
export class NoteRepository {
	constructor(@Inject(DI_PRISMA_SERVICE) private prismaService: PrismaService) {
	}

	public async findNotesByTitle(title: string): Promise<NoteModel[]> {
		const allNotes = await this.prismaService.note.findMany({
			where: {
				title: {
					contains: title,
					mode: 'insensitive',
				},
			},
		});
		return allNotes;
	}

	public async upsertNote(note: NoteModel): Promise<NoteModel> {
		const createdNote = await this.prismaService.note.upsert({
			where: {title: note.title},
			update: {content: note.content},
			create: {title: note.title!, content: note.content!}
		});
		return createdNote;
	}

	public async removeNote(title: string): Promise<void> {
		await this.prismaService.note.delete({
			where: {
				title: title,
			},
		});
	}

	public async findUniqueNoteByTitle(title: string): Promise<NoteModel> {
		const note = await this.prismaService.note.findUnique({
			where: {
				title: title,
			},
		});
		return note as NoteModel;
	}
}
