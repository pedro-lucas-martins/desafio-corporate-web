import { AutoMap } from '@automapper/classes';
import { IsNotEmpty, MaxLength } from 'class-validator';
import {ApiProperty} from '@nestjs/swagger'

export class NoteReadDTO {
	@ApiProperty({
		description: "Titulo da anotação",
		required: true,
		type: String,
		minimum: 1,
		maximum: 80
	})
	@AutoMap()
	@MaxLength(80)
	@IsNotEmpty()
	public title: string;

	@ApiProperty({
		description: "Corpo da anotação",
		required: true,
		type: String,
		minimum: 1,
		maximum: 480
	})
	@AutoMap()
	@MaxLength(480)
	@IsNotEmpty()
	public content: string;
}
