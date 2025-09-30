import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength } from 'class-validator';

export class NoteUpsertDTO {
	@ApiProperty({
		description: 'Titulo da anotação',
		required: true,
		type: String,
		minimum: 1,
		maximum: 30,
	})
	@AutoMap()
	@IsNotEmpty()
	@MaxLength(30)
	public title: string;

	@ApiProperty({
		description: 'Titulo da anotação',
		required: true,
		type: String,
		minimum: 1,
		maximum: 480,
	})
	@AutoMap()
	@IsNotEmpty()
	@MaxLength(480)
	public content: string;
}
