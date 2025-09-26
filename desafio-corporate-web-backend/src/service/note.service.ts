import { Injectable } from '@nestjs/common';
import { NoteModel } from '../model';
//import { NoteReadDTO } from 'src/controller/dto/response';
//import { NoteModel } from 'src/model';

@Injectable()
export class NoteService {
	public deleteNote(title: string): void {
		console.log(`Note with ID ${title} deleted`);

		//Deletar do banco
	}

	public createNote(note: NoteModel): NoteModel {
		const createdNote = new NoteModel();
		createdNote.id = Math.floor(Math.random() * 1000) + 1;
		createdNote.title = note.title;
		createdNote.content = note.content;

		// Aqui vai salvar no banco depois

		return note;
	}

	public searchTitleList(title: string): NoteModel[] {
		const notes: NoteModel[] = [];

		//Consultar do banco procurando tudo que tem title no titulo
		//Retorno da consulta adicionado no notes
		return notes;
	}

	public getNoteContent(title: string): NoteModel {
		const note: NoteModel = new NoteModel();
		//Consultar do banco procurando o titulo exato
		//Retorno da consulta adicionado no note
		return note;
	}

	public updateNote(note: NoteModel): NoteModel {
		const updatedNote = new NoteModel();
		updatedNote.id = note.id;
		updatedNote.title = note.title;
		updatedNote.content = note.content;

		//mandar pro bd
		return updatedNote;
	}
}
