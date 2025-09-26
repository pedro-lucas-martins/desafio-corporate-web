import { AutoMap } from '@automapper/classes';

export class NoteModel {
	@AutoMap()
	id?: number;

	@AutoMap()
	creationDate?: Date;

	@AutoMap()
	lastModDate?: Date;

	@AutoMap()
	title?: string;

	@AutoMap()
	content?: string;
}
