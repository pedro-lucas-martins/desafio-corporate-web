import { AutoMap } from '@automapper/classes';
import { IsNotEmpty } from 'class-validator';

export class NoteReadDTO {
	@AutoMap()
	@IsNotEmpty()
	public title: string;

	@AutoMap()
	@IsNotEmpty()
	public content: string;
}
